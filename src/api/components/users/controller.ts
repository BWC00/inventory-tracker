import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { UtilityService } from '../../../services/utility';

import { IUser, UserDTO } from './model';
import { UserRepository } from './repository';
import { RoleRepository } from '../roles/repository';
import { AbsController } from '../abstracts/controller';

export class UserController extends AbsController<IUser, UserDTO, UserRepository> {
	private readonly roleRepo: RoleRepository = new RoleRepository();
	
	constructor() {
		super('users', new UserRepository(), new UserDTO());
	}

	/**
	 * Create user
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

			// Check if user exists
			const existingUser = await this.repo.readByEmail(dto.email);
			if (existingUser !== undefined) {
				return res.status(400).json({ status: 400, error: 'Email is already taken' });
			}

			// Give user the 'counter' role by default
			const role = await this.roleRepo.readByName('counter');
			dto.roleId = role.id

			// Generate hash of password
			dto.password = await UtilityService.hashPassword(dto.password);

			// Save user with hashed password in db
			const user = await this.repo.create(dto);

			return res.status(201).json(user);
		} catch (err) {
			return next(err);
		}
	}
}