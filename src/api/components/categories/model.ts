import { Request } from 'express';

export interface ICategory {
	id: number;
	name: string;
}

export class CategoryDTO {
	name: string;

	constructor(name?: string) {
		this.name = name;
	}

	toString(): string {
		return `(name) VALUES('${this.name}')`;
	}

	fromRequest(req: Request) {
		const { name } = req.body;
		return new CategoryDTO(name);
	}
}