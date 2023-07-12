import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { AbsRepository } from './repository';


export abstract class AbsController<T, TDTO extends { fromRequest(req: Request)}, A extends AbsRepository<T,TDTO>> {
	protected readonly name: string;
	protected readonly repo: A;
	tdto: TDTO;
	

	constructor(name: string, repo: A, tdto: TDTO) {
		this.name = name;
		this.repo = repo;
		this.tdto = tdto;
	}

	@bind
	async readAll(req: Request, res: Response, next: NextFunction) {
		try {
			const entities = await this.repo.readAll();

			return res.json(entities);
		} catch (err) {
			return next(err);
		}
    }
    
    @bind
	async read(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;

			const entity = await this.repo.read(+id);
			if (!entity) {
				return res.status(404).json({ status: 404, error: `${this.name} not found` });
			}

			return res.json(entity);
		} catch (err) {
			return next(err);
		}
    }

	@bind
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const dto = this.tdto.fromRequest(req);
			const entity: T = await this.repo.create(dto);

			return res.status(201).json(entity);
		} catch (err) { 
			return next(err);
		}
	}

	@bind
	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const dto = this.tdto.fromRequest(req);
			const { id } = req.params;

			const entity: T = await this.repo.update(dto, +id);

			return res.status(201).json(entity);
		} catch (err) { 
			return next(err);
		}
	}

    @bind
	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;

			const entity = await this.repo.read(+id);
			if (!entity) {
				return res.status(404).json({ status: 404, error: `${this.name} not found` });
			}

			await this.repo.delete(+id);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}