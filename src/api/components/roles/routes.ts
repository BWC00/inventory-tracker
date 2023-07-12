import { Router } from 'express';
import { body, param } from 'express-validator';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { IComponentRoutes } from '../abstracts/routes';

import { RoleController } from './controller';

/**
 * Represents the routes for managing roles.
 */
export class RoleRoutes implements IComponentRoutes<RoleController> {
	readonly name: string = 'roles';
	readonly controller: RoleController = new RoleController();
	readonly router: Router = Router();
	authSerivce: AuthService;

	/**
     * Constructs a new RoleRoutes instance.
     * @param defaultStrategy The default passport strategy.
     */
	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	/**
     * Initializes the routes for managing roles.
     */
	initRoutes(): void {
		/**
         * GET /roles
         * Retrieve all roles
         * Middleware:
         * - this.authService.isAuthorized(): Ensures the user is authorized.
         * - this.authService.hasPermission(this.name, 'read'): Checks if the user has the permission to read roles.
         * Handler: this.controller.readAll
         */
		this.router.get(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			this.controller.readAll
		);

		/**
         * GET /roles/:id
         * Retrieve a specific role by ID
         * Middleware:
         * - this.authService.isAuthorized(): Ensures the user is authorized.
         * - this.authService.hasPermission(this.name, 'read'): Checks if the user has the permission to read roles.
         * - param('id').isNumeric(): Validates that the 'id' parameter is numeric.
         * - this.authService.validateRequest: Validates the request using authentication service.
         * Handler: this.controller.read
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
         * POST /roles
         * Create a new role
         * Middleware:
         * - this.authService.isAuthorized(): Ensures the user is authorized.
         * - this.authService.hasPermission(this.name, 'create'): Checks if the user has the permission to create roles.
         * - body('name').isString(): Validates that the 'name' property is a string.
         * - this.authService.validateRequest: Validates the request using authentication service.
         * Handler: this.controller.create
         */
		this.router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'create'),
			body('name').isString(),
			this.authSerivce.validateRequest,
			this.controller.create
		);

		/**
         * DELETE /roles/:id
         * Delete a specific role by ID
         * Middleware:
         * - this.authService.isAuthorized(): Ensures the user is authorized.
         * - this.authService.hasPermission(this.name, 'delete'): Checks if the user has the permission to delete roles.
         * - param('id').isNumeric(): Validates that the 'id' parameter is numeric.
         * - this.authService.validateRequest: Validates the request using authentication service.
         * Handler: this.controller.delete
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
