import { pool } from '../../../config/db';

import { AbsRepository } from '../abstracts/repository';

import { IProduct, IProductSubproduct, ProductDTO, ProductSubproductDTO } from './model';

export class ProductRepository extends AbsRepository<IProduct, ProductDTO> {
	constructor() {
		super('products');
	}

	addSubproduct(productSubproduct: ProductSubproductDTO): Promise<IProductSubproduct> {
		return new Promise((resolve, reject) => {
			pool.query(
				`INSERT INTO product_subproducts ${productSubproduct} RETURNING *`,
				(err, res) => {
					if (err) {
						reject(new Error('Failed to add subproduct to product!'));
					} else resolve(res.rowCount ? res.rows[0] : undefined);
				}
			);
		});
	}
}