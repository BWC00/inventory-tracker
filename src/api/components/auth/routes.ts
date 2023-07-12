import { Router } from 'express';
import { body, param } from 'express-validator';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { IComponentRoutes } from '../abstracts/routes';

import { AuthController } from './controller';

export class AuthRoutes implements IComponentRoutes<AuthController> {
	readonly name: string = 'auth';
	readonly controller: AuthController = new AuthController();
	readonly router: Router = Router();
	authSerivce: AuthService;

	constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	/**
	 * Initialize the authentication routes.
	 */
	initRoutes(): void {
		// Sign In route
		this.router.post(
			'/signin',
			body('email').isEmail(),
			body('password').isString(),
			this.authSerivce.validateRequest,
			this.controller.signinUser
		);

		// Register route
		this.router.post(
			'/register',
			body('email').isEmail(),
			body('password').isString(),
			this.authSerivce.validateRequest,
			this.controller.registerUser
		);

		// Unregister route
		this.router.delete(
		'/unregister',
		this.authSerivce.isAuthorized(),
		this.controller.unregisterUser);
	}
}
