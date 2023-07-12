import { pool } from '../../../config/db';

import { AbsRepository } from '../abstracts/repository';

import { IRole, RoleDTO } from './model';

export class RoleRepository extends AbsRepository<IRole, RoleDTO> {
	constructor() {
		super('roles');
	}

	/**
	 * Get role by name from db
	 *
	 * @param name name of the role
	 * @returns role record with requested name
	 */
	readByName(name: string): Promise<IRole> {
		return new Promise((resolve, reject) => {
			pool.query<IRole>('SELECT * FROM roles WHERE name = $1', [name],
			(err, res) => {
				if (err) {
					reject(new Error('Failed to fetch role by name!'));
				} else resolve(res.rowCount ? res.rows[0] : undefined);
			});
		});
	}
}