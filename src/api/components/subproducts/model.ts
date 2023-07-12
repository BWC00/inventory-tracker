import { Request } from 'express';

/**
 * Represents a subproduct.
 */
export interface ISubproduct {
	id: number;
	name: string;
}

/**
 * Data transfer object for creating or updating a subproduct.
 */
export class SubproductDTO {
	name: string;

	constructor(name?: string) {
		this.name = name;
	}

	/**
     * Generates the SQL insert or update string representation of the subproduct.
     * @param format The format for the SQL statement ('insert' or 'update').
     * @returns The SQL string representation of the subproduct.
     */
	toString(format: 'insert'): string;
	toString(format: 'update'): string;
	toString(format: 'insert' | 'update'): string {
		if (format === 'insert') return `(name) VALUES('${this.name}')`;
	}

	/**
     * Creates a SubproductDTO instance from an Express request.
     * @param req The Express request object.
     * @returns A SubproductDTO instance populated with data from the request.
     */
	fromRequest(req: Request) {
		const { name } = req.body;
		return new SubproductDTO(name);
	}
}