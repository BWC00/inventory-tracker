import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { AbsController } from '../abstracts/controller';

import { IRole, RoleDTO } from './model';
import { RoleRepository } from './repository';

export class RoleController extends AbsController<IRole, RoleDTO, RoleRepository> {
	constructor() {
		super('roles', new RoleRepository(), new RoleDTO());
	}

	/**
	 * Read user roles
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */

	/**
	 * Read user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */

	/**
	 * Create user role
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */

	/**
	 * Delete user role
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
}
