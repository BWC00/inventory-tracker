import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { AbsController } from '../abstracts/controller';

import { IRole, RoleDTO } from './model';
import { RoleRepository } from './repository';

export class RoleController extends AbsController<IRole, RoleDTO, RoleRepository> {
	constructor() {
		super('roles', new RoleRepository(), new RoleDTO());
	}
}
