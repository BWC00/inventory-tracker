import { Router } from 'express';
import { body, param } from 'express-validator';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { IComponentRoutes } from '../abstracts/routes';
import { UserController } from './controller';

/**
 * Initializes the user routes.
*/
export class UserRoutes implements IComponentRoutes<UserController> {
	readonly name: string = 'users';
	readonly controller: UserController = new UserController();
	readonly router: Router = Router();
	authSerivce: AuthService;

	constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	initRoutes(): void {
		/**
		 * GET /users
         * Retrieves all users.
         * Requires authentication and permission to read users.
         * Returns an array of user objects.
         */
		this.router.get(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			this.controller.readAll
		);

		/**
		 * GET /users/:id
         * Retrieves a user by ID.
         * Requires authentication and permission to read users.
         * Expects a numeric ID as a path parameter.
         * Returns the user object matching the ID.
         */
		this.router.get(
			'/:id',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			param('id').isNumeric(),
			this.authSerivce.validateRequest,
			this.controller.read
		);

		/**
		 * POST /users
         * Creates a new user.
         * Requires authentication and permission to create users.
         * Expects an email and password in the request body.
         * Returns the created user object.
         */
		this.router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'create'),
			body('email').isEmail(),
			body('password').isString(),
			body('role_id').isNumeric(),
			this.authSerivce.validateRequest,
			this.controller.create
		);

		/**
		 * DELETE /users/:id
         * Deletes a user by ID.
         * Requires authentication and permission to delete users.
         * Expects a numeric ID as a path parameter.
         * Returns a success status if the user is deleted.
         */
		this.router.delete(
			'/:id',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'delete'),
			param('id').isNumeric(),
			this.authSerivce.validateRequest,
			this.controller.delete
		);
	}
}
