import { Request } from 'express';

export interface IProduct {
	id: number;
	name: string;
	price: number;
	category_id: number;
}

export interface IProductSubproduct {
	product_id: number;
	subproduct_id: number;
	quantity: number;
}

export class ProductDTO {
	name: string;
	price: number;
	categoryId: number;

	constructor(name?: string, price?: number, categoryId?: number) {
		this.name = name;
		this.price = price;
		this.categoryId = categoryId;
	}

	toString(format: 'insert'): string;
	toString(format: 'update'): string;
	toString(format: 'insert' | 'update'): string {
		if (format === 'insert') return `(name, price, category_id) VALUES('${this.name}', ${this.price}, ${this.categoryId})`;
	}

	fromRequest(req: Request) {
		const { name, price, category_id } = req.body;
		return new ProductDTO(name, parseFloat(price), +category_id);
	}
}

export class ProductSubproductDTO {
	productId: number;
	subproductId: number;
	quantity: number;

	constructor(productId?: number, subproductId?: number, quantity?: number) {
		this.productId = productId;
		this.subproductId = subproductId;
		this.quantity = quantity;
	}

	toString(): string {
		return `(product_id, subproduct_id, quantity) VALUES(${this.productId}, ${this.subproductId}, ${this.quantity})`;
	}

	static fromRequest(req: Request) {
		const { id } = req.params
		const { subproduct_id, quantity } = req.body;
		return new ProductSubproductDTO(+id, +subproduct_id, +quantity);
	}
}