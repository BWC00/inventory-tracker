import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import * as schedule from "node-schedule";

import { MailService } from '../../../services/mail';

import { AbsController } from '../abstracts/controller';

import { ICountPlan, CountPlanDTO } from './model';
import { ICountExecution, CountExecutionDTO } from '../count-executions/model';
import { IUser } from '../users/model';

import { CountPlanRepository } from './repository';
import { UserRepository } from '../users/repository';
import { CountExecutionRepository } from '../count-executions/repository';

export class CountPlanController extends AbsController<ICountPlan, CountPlanDTO, CountPlanRepository> {
	private readonly userRepo: UserRepository = new UserRepository();
	private readonly countExecutionRepo: CountExecutionRepository = new CountExecutionRepository();
	private readonly mailService: MailService = new MailService();

	constructor() {
		super('countplans', new CountPlanRepository(), new CountPlanDTO());
	}

	@bind
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const dto = this.tdto.fromRequest(req);
			const countPlan: ICountPlan = await this.repo.create(dto);
            schedule.scheduleJob(""+countPlan.id, countPlan.repetition_schedule, async () => {
                var countExecutionDTO: CountExecutionDTO = new CountExecutionDTO(countPlan.id, 'ongoing');
                const countExecution: ICountExecution = await this.countExecutionRepo.create(countExecutionDTO);
		    	console.log(`CountExecution ${countExecution.id} started on ${new Date().toLocaleTimeString()} and is running...`);

				// notify users
				this.notifyUsers(countPlan.id, `CountExecution ${countExecution.id} started!`, `Countexecution ${countExecution.id} started!`);
				
				//TODO: change duration to 24 hours
                schedule.scheduleJob(new Date(Date.now() + 30 * 1000), async () => {
                    countExecutionDTO.status = 'end';
                   	await this.countExecutionRepo.update(countExecutionDTO, countExecution.id);    
		    		console.log(`CountExecution ${countExecution.id} ended on ${new Date().toLocaleTimeString()}`);

					// notify users
					this.notifyUsers(countPlan.id, `Countexecution ${countExecution.id} ended.`, `Countexecution ${countExecution.id} ended.`);
                });
		    });

			return res.status(201).json(countPlan);
		} catch (err) { 
			return next(err);
		}
	}

    @bind
	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;

			const countPlan = await this.repo.read(+id);
			if (!countPlan) {
				return res.status(404).json({ status: 404, error: 'CountPlan not found' });
			}

		    var current_job = schedule.scheduledJobs[countPlan.id];
		    current_job.cancel();

			await this.repo.delete(+id);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}

	@bind
	async addUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
            const { user_id } = req.body;

			const countPlan = await this.repo.read(+id);
			if (!countPlan) {
				return res.status(404).json({ status: 404, error: 'Count plan not found' });
			}

			const user = await this.userRepo.read(+user_id);
			if (!user) {
				return res.status(404).json({ status: 404, error: 'User not found' });
			}

			await this.repo.addUser(+id, +user_id);

			return res.status(201).send();
		} catch (err) {
			return next(err);
		}
	}

	@bind
	async getUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;

			const countPlan = await this.repo.read(+id);
			if (!countPlan) {
				return res.status(404).json({ status: 404, error: 'Count plan not found' });
			}

			const users: IUser[] = await this.repo.getUsers(+id);

			return res.json(users);
		} catch (err) {
			return next(err);
		}
	}

	@bind
	private async notifyUsers(id: number, subject: string, text: string) {
		try {
			const users: IUser[] = await this.repo.getUsers(id);
			if (!users) {
				return;
			}

			let emails: string[] = [];

			for (let i = 0; i < users.length; i++) {
				emails.push(users[i].email);
			}

			this.mailService.sendMail(emails, subject, text);
		} catch(err) {
			throw err
		}
	}
}