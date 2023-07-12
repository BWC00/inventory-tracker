import { Router } from 'express';
import { body, param } from 'express-validator';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { IComponentRoutes } from '../abstracts/routes';

import { SubproductController } from './controller';

export class SubproductRoutes implements IComponentRoutes<SubproductController> {
	readonly name: string = 'subproducts';
	readonly controller: SubproductController = new SubproductController();
	readonly router: Router = Router();
	authSerivce: AuthService;

	constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	/**
     * Initializes the subproduct routes.
     */
	initRoutes(): void {
		/**
         * GET /subproducts
         * Retrieves all subproducts.
         * Authorization: Required
         * Permissions: 'read'
         */
		this.router.get(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			this.controller.readAll
		);

		/**
         * GET /subproducts/:id
         * Retrieves a specific subproduct by ID.
         * Authorization: Required
         * Permissions: 'read'
         * Params:
         *  - id: The ID of the subproduct (numeric)
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
         * POST /subproducts
         * Creates a new subproduct.
         * Authorization: Required
         * Permissions: 'create'
         * Body:
         *  - name: The name of the subproduct (string)
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
         * DELETE /subproducts/:id
         * Deletes a specific subproduct by ID.
         * Authorization: Required
         * Permissions: 'delete'
         * Params:
         *  - id: The ID of the subproduct (numeric)
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