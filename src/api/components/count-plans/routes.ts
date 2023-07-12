import { Router } from 'express';
import { body, param } from 'express-validator';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { IComponentRoutes } from '../abstracts/routes';

import { CountPlanController } from './controller';

export class CountPlanRoutes implements IComponentRoutes<CountPlanController> {
	readonly name: string = 'count-plans';
	readonly controller: CountPlanController = new CountPlanController();
	readonly router: Router = Router();
	authSerivce: AuthService;

	constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	/**
	 * Initialize the routes for count plans
	 */
	initRoutes(): void {
		// Route for retrieving all count plans
		this.router.get(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			this.controller.readAll
		);

		// Route for retrieving a specific count plan by ID
		this.router.get(
			'/:id',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			param('id').isNumeric(),
			this.authSerivce.validateRequest,
			this.controller.read
		);

		// Route for creating a new count plan
		this.router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'create'),
			body('repetition_schedule').isString(),
			this.authSerivce.validateRequest,
			this.controller.create
		);

		// Route for retrieving all users subscribed to a count plan
        this.router.get(
			'/:id/users',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
            param('id').isNumeric(),
			this.authSerivce.validateRequest,
			this.controller.getUsers
		);

		// Route for adding/subscribing a user to a count plan
        this.router.post(
			'/:id/users',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'create'),
            param('id').isNumeric(),
			body('user_id').isNumeric(),
			this.authSerivce.validateRequest,
			this.controller.addUser
		);

		// Route for deleting a count plan
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
