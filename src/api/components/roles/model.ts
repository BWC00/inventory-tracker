import { Request } from 'express';

/**
 * Represents a role.
 */
export interface IRole {
	id: number;
	name: string;
}

/**
 * Data transfer object (DTO) for creating or updating a role.
 */
export class RoleDTO {
	name: string;

	constructor(name?: string){
		this.name = name;
	}

	/**
     * Converts the RoleDTO instance to a string representation for insertion or update.
     * @param format The format type ('insert' or 'update').
     * @returns A string representation of the RoleDTO instance.
     */
	toString(format: 'insert'): string;
	toString(format: 'update'): string;
	toString(format: 'insert' | 'update'): string {
		if (format === 'insert') return `(name) VALUES('${this.name}')`;
	}

	/**
     * Creates a RoleDTO instance from the request object.
     * @param req The Express request object.
     * @returns A RoleDTO instance created from the request body.
     */
	fromRequest(req: Request) {
		const { name } = req.body;
		return new RoleDTO(name);
	}
}