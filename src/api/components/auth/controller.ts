import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { AuthService } from '../../../services/auth';
import { UtilityService } from '../../../services/utility';

import { IUser, UserDTO } from '../users/model';
import { UserRepository } from '../users/repository';
import { RoleRepository } from '../roles/repository';

export class AuthController {
	private readonly authService: AuthService = new AuthService();
	private readonly roleRepo: RoleRepository = new RoleRepository();
	private readonly repo: UserRepository = new UserRepository();
	

	/**
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async signinUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { email, password } = req.body;

			const user: IUser | undefined = await this.repo.readByEmail(email);

			if (!user || !(await UtilityService.verifyPassword(password, user.password))) {
				return res.status(401).json({ status: 401, error: 'Wrong email or password' });
			}

			// Create jwt -> required for further requests
			const token: string = this.authService.createToken(user.id);

			// Don't send user password in response
			delete user.password;

			return res.json({ token, user });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Register new user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async registerUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const dto = new UserDTO().fromRequest(req);

			const user: IUser | undefined = await this.repo.readByEmail(dto.email);

			if (user) {
				return res.status(400).json({ error: 'Email is already taken' });
			}

			dto.password = await UtilityService.hashPassword(dto.password);

			// Give user the 'counter' role by default
			const role = await this.roleRepo.readByName('counter');
			dto.roleId = role.id

			const savedUser = await this.repo.create(dto);

			return res.status(201).json(savedUser);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Unregister user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async unregisterUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { email } = req.user as IUser;

			const user: IUser | undefined = await this.repo.readByEmail(email);

			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}

			await this.repo.delete(user.id);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
