import { pool } from '../../../config/db';

import { AbsRepository } from '../abstracts/repository';

import { ICountPlan, CountPlanDTO } from './model';
import { IUser } from '../users/model';

export class CountPlanRepository extends AbsRepository<ICountPlan, CountPlanDTO> {
	constructor() {
		super('count_plans');
	}

    addUser(id: number, userId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
			pool.query<ICountPlan>('INSERT INTO count_plan_users (count_plan_id, user_id) VALUES($1, $2)',
                [id, userId],
                (err, res) => {
			        if (err) {
					    reject(new Error('Failed to add user to countplan!'));
				    } else resolve(res.rowCount > 0);
			    }
            );
		});
    }

	getUsers(id: number): Promise<IUser[]> {
		return new Promise((resolve, reject) => {
			pool.query<IUser>('SELECT * FROM (SELECT user_id AS id FROM count_plan_users WHERE count_plan_id = $1) AS subx  NATURAL JOIN users', [id], (err, res) => {
				if (err) {
					reject(new Error('Failed to fetch users subscribed to countplan!'));
				} else resolve(res.rows);
			});
		});
	}
}