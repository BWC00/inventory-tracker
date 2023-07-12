import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { AbsController } from '../abstracts/controller';

import { IProduct, IProductSubproduct, ProductDTO, ProductSubproductDTO } from './model';
import { ICategory } from '../categories/model';

import { ProductRepository } from './repository';
import { CategoryRepository } from '../categories/repository';
import { SubproductRepository } from '../subproducts/repository';
import { ISubproduct } from '../subproducts/model';


export class ProductController extends AbsController<IProduct, ProductDTO, ProductRepository> {

	// Handle category and subproduct operations
	private readonly categoryRepo: CategoryRepository = new CategoryRepository();
	private readonly subproductRepo: SubproductRepository = new SubproductRepository();

	constructor() {
		super('products', new ProductRepository(), new ProductDTO());
	}

	/**
	 * Create product
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const dto = this.tdto.fromRequest(req);

			// Retrieve the category for the product using the provided category ID and check if it exists.
			const category: ICategory = await this.categoryRepo.read(dto.categoryId);
			if (!category) {
				return res.status(404).json({ status: 404, error: 'Category not found' });
			}

			// Create the product using the provided DTO.
			const product: IProduct = await this.repo.create(dto);

			// Return the created product.
			return res.status(201).json(product);
		} catch (err) { 
			return next(err);
		}
	}

	/**
	 * Add subproduct to product collection of subproducts
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async addSubproduct(req: Request, res: Response, next: NextFunction) {
		try {
			const dto = ProductSubproductDTO.fromRequest(req);

			// Retrieve the product using the provided product ID and check if it exists.
			const product: IProduct = await this.repo.read(dto.productId);
			if (!product) {
				return res.status(404).json({ status: 404, error: 'Product not found' });
			}

			// Retrieve the subproduct using the provided subproduct ID and check if it exists.
			const subproduct: ISubproduct = await this.subproductRepo.read(dto.subproductId);
			if (!subproduct) {
				return res.status(404).json({ status: 404, error: 'Subproduct not found' });
			}

			// Add the subproduct to the product's collection of subproduct.
			const productSubproduct: IProductSubproduct = await this.repo.addSubproduct(dto);

			// Return the created product-subproduct relationship.
			return res.status(201).json(productSubproduct);
			
		} catch (err) {
			return next(err);
		}
	}
}