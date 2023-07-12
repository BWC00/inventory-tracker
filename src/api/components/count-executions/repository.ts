import { pool } from '../../../config/db';

import { AbsRepository } from '../abstracts/repository';

import { ICountExecution, IUserProductCount, IPricing, CountExecutionDTO, UserProductCountDTO } from './model';

export class CountExecutionRepository extends AbsRepository<ICountExecution, CountExecutionDTO> {
	constructor() {
		super('count_executions');
	}

	/**
	 * Add user product count record in db
	 *
	 * @param userProductCount entity with user product counts
	 * @returns added entity with user product counts
	 */
    addUserProductCount(userProductCount: UserProductCountDTO): Promise<IUserProductCount> {
        return new Promise((resolve, reject) => {
			pool.query<IUserProductCount>(`INSERT INTO user_product_counts ${userProductCount} RETURNING *`,
                (err, res) => {
			        if (err) {
					    reject(new Error('Failed to add userproductcount!'));
				    } else resolve(res.rowCount ? res.rows[0] : undefined);
			    }
            );
		});
    }

	/**
	 * Get pricing per product record of countexecution from db
	 *
	 * @param id identifier of countexecution
	 * @returns pricing per product
	 */
	getPricingByProduct(id: number): Promise<IPricing[]> {
		return new Promise((resolve, reject) => {
			pool.query<IPricing>(`SELECT product_id, SUM(price) AS price FROM (${this.getPricingSubquery(id)}) AS p_sub GROUP BY product_id`
			, (err, res) => {
				if (err) {
					reject(new Error('Failed to fetch pricing by products!'));
				} else resolve(res.rows);
			});
		});
	}

	/**
	 * Get pricing per category of countexecution from db
	 *
	 * @param id identifier of countexecution
	 * @returns pricing per category
	 */
	getPricingByCategory(id: number): Promise<IPricing[]> {
		return new Promise((resolve, reject) => {
			pool.query<IPricing>(`SELECT category_id, SUM(price) AS price FROM (${this.getPricingSubquery(id)}) AS p_sub GROUP BY category_id`
			, (err, res) => {
				if (err) {
					reject(new Error('Failed to fetch pricing by category!'));
				} else resolve(res.rows);
			});
		});
	}

	/**
	 * Get total pricing of countexecution from db
	 *
	 * @param id identifier of countexecution
	 * @returns total pricing
	 */
	getPricing(id: number): Promise<IPricing> {
		return new Promise((resolve, reject) => {
			pool.query<IPricing>(`SELECT SUM(price) AS total_price FROM (${this.getPricingSubquery(id)}) AS p_sub`,
			(err, res) => {
				if (err) {
					reject(new Error('Failed to fetch total pricing!'));
				} else resolve(res.rowCount ? res.rows[0] : undefined);
			});
		});
	}

	/**
	 * Subquery table with calculated prices per product and category
	 *
	 * @param id identifier of countexecution
	 * @returns subquery string
	 */
	getPricingSubquery(id: number): string {
		return `WITH don AS (
			SELECT t.product_id, t.subproduct_id, t.quantity, o.total_quantity, t.category_id, t.price
			FROM (product_subproducts JOIN products ON product_subproducts.product_id = products.id) AS t
			LEFT JOIN (
				SELECT SUM(quantity) AS total_quantity, subproduct_id
				FROM (SELECT b.subproduct_id, quantity
					FROM (SELECT * FROM user_product_counts WHERE count_execution_id = ${id}) AS SUBJ
					JOIN barcode_scanners b
					ON SUBJ.barcode_scanner_id = b.id
				) AS SUBG
				GROUP BY subproduct_id
			) AS o ON t.subproduct_id = o.subproduct_id
		)

		SELECT product_id, category_id, MIN((total_quantity / quantity) * price) AS price FROM (SELECT *
		FROM don
		WHERE NOT EXISTS (
			SELECT *
			FROM don AS g
			WHERE don.product_id = g.product_id AND g.total_quantity IS NULL
		)) AS tabx GROUP BY product_id, category_id`
	}
}