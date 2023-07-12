import { bind } from 'decko';

import { pool } from '../../../config/db';

import { RedisService } from '../../../services/redis';

export abstract class AbsRepository<T, TDTO extends { toString(format: 'insert' | 'update'): string }> {
	protected readonly name: string;

	constructor(name: string) {
		this.name = name;
	}

	/**
	 * Delete cache entries
	 */
	@bind
	deleteFromCache() {
		RedisService.deleteByKey(this.name);
	}

	/**
	 * Read all entities from db
	 *
	 * @param cached Use cache
	 * @returns Entity array
	 */
	@bind
	readAll(cached?: boolean): Promise<T[]> {
		if (cached) {
			return RedisService.getAndSetObject<T[]>(this.name, () => this.readAll(false));
		}

		return new Promise((resolve, reject) => {
			pool.query<T>(`SELECT * FROM ${this.name}`, (err, res) => {
				if (err) {
					reject(new Error(`Failed to fetch ${this.name}!`));
				} else resolve(res.rows);
			});
		});
	}

	/**
	 * Read a certain entity from db by id
	 *
	 * @param id Identifier of entity to read
	 * @returns Entity
	*/
	read(id: number): Promise<T> {
		return new Promise((resolve, reject) => {
			pool.query<T>(`SELECT * FROM ${this.name} WHERE id = $1`, [id], (err, res) => {
				if (err) {
					reject(new Error(`Failed to fetch ${this.name}!`));
				} else resolve(res.rowCount ? res.rows[0] : undefined);
			});
		});
	}

	/**
	 * create entity in db
	 *
	 * @param entity Entity to create
	 * @returns Created entity
	 */
	@bind
	create(entity: TDTO): Promise<T> {
		return new Promise((resolve, reject) => {
			pool.query(
				`INSERT INTO ${this.name} ${entity.toString('insert')} RETURNING *`,
				(err, res) => {
					if (err) {
						reject(new Error(`Failed to create ${this.name}!`));
					} else {
						this.deleteFromCache();
						resolve(res.rowCount ? res.rows[0] : undefined);
					}
				}
			);
		});
	}

	/**
	 * Update entity from db
	 *
	 * @param entity entity with updated information
	 * @param id Identifier of entity to delete
	 * @returns Updated entity
	 */
	update(entity: TDTO, id: number): Promise<T> {
		return new Promise((resolve, reject) => {
			pool.query(`UPDATE ${this.name} SET ${entity.toString('update')} WHERE id = $1 RETURNING *`,[id],
				(err, res) => {
					if (err) {
						reject(new Error(`Failed to update ${this.name}!`));
					} else {
					    this.deleteFromCache();
                        resolve(res.rowCount ? res.rows[0] : undefined);
                    }
				}
			);
		});
	}

	/**
	 * Delete entity from db
	 *
	 * @param id Identifier of entity to delete
	 * @returns Deleted entity
	 */
	@bind
	delete(id: number): Promise<boolean> {
		return new Promise((resolve, reject) => {
			pool.query<T>(`DELETE FROM ${this.name} WHERE id = $1`, [id],
                (err, res) => {
				    if (err) {
					    reject(new Error(`Failed to delete ${this.name}!`));
				    } else {
					    this.deleteFromCache();
					    resolve(res.rowCount > 0);
				    }
			    }
            );
		});
	}
}