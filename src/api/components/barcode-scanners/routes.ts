import { Router } from 'express';
import { body, param } from 'express-validator';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { IComponentRoutes } from '../abstracts/routes';

import { BarcodeScannerController } from './controller';

export class BarcodeScannerRoutes implements IComponentRoutes<BarcodeScannerController> {
	readonly name: string = 'barcode-scanners';
	readonly controller: BarcodeScannerController = new BarcodeScannerController();
	readonly router: Router = Router();
	authSerivce: AuthService;

	constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	/**
	 * Initialize the barcode scanner routes.
	 */
	initRoutes(): void {
		// Read all barcode scanners route
		this.router.get(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			this.controller.readAll
		);

		// Read a single barcode scanner route
		this.router.get(
			'/:id',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			param('id').isNumeric(),
			this.authSerivce.validateRequest,
			this.controller.read
		);

		// Create a new barcode scanner route
		this.router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'create'),
			body('subproduct_id').isNumeric(),
			body('barcode').isString(),
			this.authSerivce.validateRequest,
			this.controller.create
		);

		// Delete a barcode scanner route
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