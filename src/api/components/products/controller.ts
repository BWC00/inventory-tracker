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
	private readonly categoryRepo: CategoryRepository = new CategoryRepository();
	private readonly subproductRepo: SubproductRepository = new SubproductRepository();

	constructor() {
		super('products', new ProductRepository(), new ProductDTO());
	}

	@bind
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const dto = this.tdto.fromRequest(req);

			const category: ICategory = await this.categoryRepo.read(dto.categoryId);
			if (!category) {
				return res.status(404).json({ status: 404, error: 'Category not found' });
			}

			const product: IProduct = await this.repo.create(dto);

			return res.status(201).json(product);
		} catch (err) { 
			return next(err);
		}
	}

	@bind
	async addSubproduct(req: Request, res: Response, next: NextFunction) {
		try {
			const dto = ProductSubproductDTO.fromRequest(req);

			const product: IProduct = await this.repo.read(dto.productId);
			if (!product) {
				return res.status(404).json({ status: 404, error: 'Product not found' });
			}

			const subproduct: ISubproduct = await this.subproductRepo.read(dto.subproductId);
			if (!subproduct) {
				return res.status(404).json({ status: 404, error: 'Subproduct not found' });
			}

			const productSubproduct: IProductSubproduct = await this.repo.addSubproduct(dto);

			return res.status(201).json(productSubproduct);
			
		} catch (err) {
			return next(err);
		}
	}
}