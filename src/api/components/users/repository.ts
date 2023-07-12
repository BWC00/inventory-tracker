import { pool } from '../../../config/db';

import { AbsRepository } from '../abstracts/repository';

import { IUser, UserDTO } from './model';

export class UserRepository extends AbsRepository<IUser, UserDTO> {
	constructor() {
		super('users');
	}

	/**
	 * Get user by email from db
	 *
	 * @param email email of the user
	 * @returns user record with requested email
	 */
	readByEmail(email: string): Promise<IUser> {
		return new Promise((resolve, reject) => {
			pool.query<IUser>('SELECT * FROM users WHERE email = $1', [email], (err, res) => {
				if (err) {
					reject(new Error('Failed to fetch user by email!'));
				} else resolve(res.rowCount ? res.rows[0] : undefined);
			});
		});
	}
}