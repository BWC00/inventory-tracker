import { Request } from 'express';

export interface IRole {
	id: number;
	name: string;
}

export class RoleDTO {
	name: string;

	constructor(name?: string){
		this.name = name;
	}

	toString(format: 'insert'): string;
	toString(format: 'update'): string;
	toString(format: 'insert' | 'update'): string {
		if (format === 'insert') return `(name) VALUES('${this.name}')`;
	}

	fromRequest(req: Request) {
		const { name } = req.body;
		return new RoleDTO(name);
	}
}