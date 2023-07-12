import { Request } from 'express';

/**
 * Represents a user.
 */
export interface IUser {
	id: number;
	email: string;
	password: string;
	role_id: number;
	created_at: Date;
}

/**
 * Represents the data transfer object (DTO) for creating or updating a user.
 */
export class UserDTO {
	email: string;
	password: string;
	roleId: number;

	constructor(email?: string, password?: string, roleId?: number){
		this.email = email;
		this.password = password;
		this.roleId = roleId;
	}

	/**
     * Generates the SQL INSERT or UPDATE statement for the user.
     * @param format The format of the statement ('insert' or 'update').
     * @returns The generated SQL statement.
     */
	toString(format: 'insert'): string;
	toString(format: 'update'): string;
	toString(format: 'insert' | 'update'): string {
    	if (format === 'insert') return  `(email, password, role_id) VALUES('${this.email}', '${this.password}', ${this.roleId})`;
 	}

	/**
     * Creates a UserDTO instance from an Express request.
     * @param req The Express request.
     * @returns A new UserDTO instance populated with data from the request.
     */
	fromRequest(req: Request) {
		const { email, password } = req.body;
		return new UserDTO(email, password);
	}
}