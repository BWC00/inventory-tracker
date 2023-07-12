import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { AuthService } from '../../../services/auth';
import { UtilityService } from '../../../services/utility';

import { IUser, UserDTO } from '../users/model';
import { UserRepository } from '../users/repository';
import { RoleRepository } from '../roles/repository';

export class AuthController {

	/**
	 * AuthController constructor.
	 * Initializes the necessary service and repository instances.
	 */
	private readonly authService: AuthService = new AuthService();
	private readonly roleRepo: RoleRepository = new RoleRepository();
	private readonly repo: UserRepository = new UserRepository();
	

	/**
	 * Authenticates a user and generates a JSON Web Token (JWT) for further requests.
	 * 
	 * URL: POST /api/v1/auth/signin
	 * 
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async signinUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			// Extract email and password from the request body
			const { email, password } = req.body;

			// Find the user based on the provided email
			const user: IUser | undefined = await this.repo.readByEmail(email);

			// Check if the user exists and verify the password
			if (!user || !(await UtilityService.verifyPassword(password, user.password))) {
				return res.status(401).json({ status: 401, error: 'Wrong email or password' });
			}

			// Create a JSON Web Token (JWT) for the authenticated user
			const token: string = this.authService.createToken(user.id);

			// Don't send user password in response
			delete user.password;

			// Return the JWT and user object in the response
			return res.json({ token, user });
		} catch (err) {
			// Pass the error to the error handling middleware
			return next(err);
		}
	}

	/**
	 * Registers a new user.
	 *
	 * URL: POST /api/v1/auth/register
	 * 
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async registerUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			// Create a UserDTO instance from the request body
			const dto = new UserDTO().fromRequest(req);

			// Check if a user with the same email already exists
			const user: IUser | undefined = await this.repo.readByEmail(dto.email);
			if (user) {
				return res.status(400).json({ error: 'Email is already taken' });
			}

			// Hash the user's password before saving it
			dto.password = await UtilityService.hashPassword(dto.password);

			// Give the user the 'counter' role by default
			const role = await this.roleRepo.readByName('counter');
			dto.roleId = role.id

			// Create the user using the UserRepository
			const savedUser = await this.repo.create(dto);

			// Return the created user in the response
			return res.status(201).json(savedUser);
		} catch (err) {
			// Pass the error to the error handling middleware
			return next(err);
		}
	}

	/**
	 * Unregisters a user.
	 * 
	 * URL: DELETE /api/v1/auth/unregister
	 * Authentication: Bearer Token
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async unregisterUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			// Get the email of the authenticated user from the request object
			const { email } = req.user as IUser;

			// Find the user based on the email
			const user: IUser | undefined = await this.repo.readByEmail(email);
			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}

			// Delete the user using the UserRepository
			await this.repo.delete(user.id);

			// Return a success response
			return res.status(204).send();
		} catch (err) {
			// Pass the error to the error handling middleware
			return next(err);
		}
	}
}
