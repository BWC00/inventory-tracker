import { Router } from 'express';

import { AuthService } from '../../../services/auth';

export interface IComponentRoutes<T> {
	readonly name: string;
	readonly controller: T;
	readonly router: Router;
	authSerivce: AuthService;

	initRoutes(): void;
	initChildRoutes?(): void;
}