import { Router } from 'express';
import { body, param, query } from 'express-validator';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { IComponentRoutes } from '../abstracts/routes';

import { CountExecutionController } from './controller';

export class CountExecutionRoutes implements IComponentRoutes<CountExecutionController> {
	readonly name: string = 'count-executions';
	readonly controller: CountExecutionController = new CountExecutionController();
	readonly router: Router = Router();
	authSerivce: AuthService;

	constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	/**
	 * Initialize the count execution routes.
	 */
	initRoutes(): void {
		// Read all count executions route
		this.router.get(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			this.controller.readAll
		);

		// Read a single count execution route
		this.router.get(
			'/:id',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			param('id').isNumeric(),
			this.authSerivce.validateRequest,
			this.controller.read
		);

		// Read pricing of an ended count execution
		this.router.get(
			'/:id/pricing',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
            param('id').isNumeric(),
			query('order_by').optional().isString().isIn(['category', 'product']),	
			this.authSerivce.validateRequest,
			this.controller.getPricing
		);

		// Add user product counts to an ongoing count execution
        this.router.post(
			'/:id/user-product-counts',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'add-user-product-count'),
            param('id').isNumeric(),
			body('barcode_scanner_id').isNumeric(),
			body('quantity').isNumeric(),
			this.authSerivce.validateRequest,
			this.controller.addUserProductCount
		);

		// Delete a count execution route
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
