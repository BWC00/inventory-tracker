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

	/**
	 * Create a count plan and schedule to execute an countexecution based on a repetition schedule
	 * Users get notified via email when a countexecution starts/ends
	 * 
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const dto = this.tdto.fromRequest(req);
			const countPlan: ICountPlan = await this.repo.create(dto);

			// Schedule count execution based on repetition schedule
            schedule.scheduleJob(""+countPlan.id, countPlan.repetition_schedule, async () => {
				// Create a count execution
                var countExecutionDTO: CountExecutionDTO = new CountExecutionDTO(countPlan.id, 'ongoing');
                const countExecution: ICountExecution = await this.countExecutionRepo.create(countExecutionDTO);
		    	console.log(`CountExecution ${countExecution.id} started on ${new Date().toLocaleTimeString()} and is running...`);

				// Notify users via email about the count execution start
				this.notifyUsers(countPlan.id, `CountExecution ${countExecution.id} started!`, `Countexecution ${countExecution.id} started!`);
				
				// Started Count execution lasts for 24 hours
                schedule.scheduleJob(new Date(Date.now() + 24 * 60 * 60 * 1000), async () => {
					// Update count execution status to 'end'
                    countExecutionDTO.status = 'end';
                   	await this.countExecutionRepo.update(countExecutionDTO, countExecution.id);    
		    		console.log(`CountExecution ${countExecution.id} ended on ${new Date().toLocaleTimeString()}`);

					// Notify users via email about the count execution end
					this.notifyUsers(countPlan.id, `Countexecution ${countExecution.id} ended.`, `Countexecution ${countExecution.id} ended.`);
                });
		    });

			return res.status(201).json(countPlan);
		} catch (err) { 
			return next(err);
		}
	}

	/**
	 * Delete count plan
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
    @bind
	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;

			// Check if the count plan exists
			const countPlan = await this.repo.read(+id);
			if (!countPlan) {
				return res.status(404).json({ status: 404, error: 'CountPlan not found' });
			}

			// Cancel the scheduled job for the count plan
		    var current_job = schedule.scheduledJobs[countPlan.id];
		    current_job.cancel();

			// Delete the count plan
			await this.repo.delete(+id);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Add/Subscribe user to count plan
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async addUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
            const { user_id } = req.body;

			// Check if the count plan exists
			const countPlan = await this.repo.read(+id);
			if (!countPlan) {
				return res.status(404).json({ status: 404, error: 'Count plan not found' });
			}

			// Check if the user exists
			const user = await this.userRepo.read(+user_id);
			if (!user) {
				return res.status(404).json({ status: 404, error: 'User not found' });
			}

			// Add the user to the count plan
			await this.repo.addUser(+id, +user_id);

			return res.status(201).send();
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Get all users subscribed to count plan
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async getUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;

			// Check if the count plan exists
			const countPlan = await this.repo.read(+id);
			if (!countPlan) {
				return res.status(404).json({ status: 404, error: 'Count plan not found' });
			}

			// Get all users subscribed to the count plan
			const users: IUser[] = await this.repo.getUsers(+id);

			return res.json(users);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Notify users via email (on change of count execution status)
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	private async notifyUsers(id: number, subject: string, text: string) {
		try {

			// Get all users subscribed to the count plan
			const users: IUser[] = await this.repo.getUsers(id);
			if (!users) {
				return;
			}

			// Extract the email addresses of the users
			const emails: string[] = users.map(user => user.email);

			// Send email notifications to the users
			this.mailService.sendMail(emails, subject, text);
		} catch(err) {
			throw err
		}
	}
}