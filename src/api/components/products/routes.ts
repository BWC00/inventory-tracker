import { Router } from 'express';
import { body, param } from 'express-validator';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { IComponentRoutes } from '../abstracts/routes';

import { ProductController } from './controller';

export class ProductRoutes implements IComponentRoutes<ProductController> {
	readonly name: string = 'products';
	readonly controller: ProductController = new ProductController();
	readonly router: Router = Router();
	authSerivce: AuthService;

	constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	/**
     * Initialize the routes for the Product component.
     */
	initRoutes(): void {
		/**
         * GET /products
         * Retrieve all products.
         * Requires authorization and read permission.
         */
		this.router.get(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			this.controller.readAll
		);

		/**
         * GET /products/:id
         * Retrieve a specific product by ID.
         * Requires authorization, read permission, and a valid numeric ID parameter.
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
         * POST /products
         * Create a new product.
         * Requires authorization, create permission, and valid request body parameters: name (string), price (numeric), and category_id (numeric).
         */
		this.router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'create'),
			body('name').isString(),
			body('price').isNumeric(),
			body('category_id').isNumeric(),
			this.authSerivce.validateRequest,
			this.controller.create
		);

		/**
         * DELETE /products/:id
         * Delete a specific product by ID.
         * Requires authorization, delete permission, and a valid numeric ID parameter.
         */
		this.router.delete(
			'/:id',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'delete'),
			param('id').isNumeric(),
			this.authSerivce.validateRequest,
			this.controller.delete
		);

		/**
         * POST /products/:id/subproducts
         * Add a subproduct to a product's collection of subproducts.
         * Requires authorization, create permission, and valid request body parameters: subproduct_id (numeric) and quantity (numeric).
         */
		this.router.post(
			'/:id/subproducts',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'create'),
			param('id').isNumeric(),
			body('subproduct_id').isNumeric(),
			body('quantity').isNumeric(),
			this.authSerivce.validateRequest,
			this.controller.addSubproduct
		);
	}
}