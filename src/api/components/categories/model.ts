import { Request } from 'express';

// Define the structure of a category
export interface ICategory {
	id: number;
	name: string;
}

// Data Transfer Object (DTO) for a category
export class CategoryDTO {
	name: string;

	/**
	 * Construct a CategoryDTO instance.
	 *
	 * @param name The name of the category.
	 */
	constructor(name?: string) {
		this.name = name;
	}

	/**
	 * Convert the DTO instance to a string representation.
	 *
	 * @returns The string representation of the DTO instance.
	 */
	toString(): string {
		return `(name) VALUES('${this.name}')`;
	}

	/**
	 * Create a CategoryDTO instance from an Express request.
	 *
	 * @param req The Express request object.
	 * @returns A new CategoryDTO instance created from the request.
	 */
	fromRequest(req: Request) {
		const { name } = req.body;
		return new CategoryDTO(name);
	}
}