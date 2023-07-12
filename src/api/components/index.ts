import { Router } from 'express';

import { AuthRoutes } from './auth/routes';
import { RoleRoutes } from './roles/routes';
import { UserRoutes } from './users/routes';
import { CategoryRoutes } from './categories/routes';
import { ProductRoutes } from './products/routes';
import { SubproductRoutes } from './subproducts/routes';
import { BarcodeScannerRoutes } from './barcode-scanners/routes';
import { CountPlanRoutes } from './count-plans/routes';
import { CountExecutionRoutes } from './count-executions/routes';

/**
 * Init component routes
 *
 * @param {Router} router
 * @param {string} prefix
 * @returns {void}
 */
export function registerApiRoutes(router: Router, prefix: string = ''): void {
	router.use(`${prefix}/auth`, new AuthRoutes().router);
	router.use(`${prefix}/roles`, new RoleRoutes().router);
	router.use(`${prefix}/users`, new UserRoutes().router);
	router.use(`${prefix}/categories`, new CategoryRoutes().router);
	router.use(`${prefix}/products`, new ProductRoutes().router);
	router.use(`${prefix}/subproducts`, new SubproductRoutes().router);
	router.use(`${prefix}/barcode-scanners`, new BarcodeScannerRoutes().router);
	router.use(`${prefix}/count-plans`, new CountPlanRoutes().router);
	router.use(`${prefix}/count-executions`, new CountExecutionRoutes().router);
}