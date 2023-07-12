import { Request } from 'express';

export interface IUser {
	id: number;
	email: string;
	password: string;
	role_id: number;
	created_at: Date;
}

export class UserDTO {
	email: string;
	password: string;
	roleId: number;

	constructor(email?: string, password?: string, roleId?: number){
		this.email = email;
		this.password = password;
		this.roleId = roleId;
	}

	toString(format: 'insert'): string;
	toString(format: 'update'): string;
	toString(format: 'insert' | 'update'): string {
    	if (format === 'insert') return  `(email, password, role_id) VALUES('${this.email}', '${this.password}', ${this.roleId})`;
 	}

	fromRequest(req: Request) {
		const { email, password } = req.body;
		return new UserDTO(email, password);
	}
}