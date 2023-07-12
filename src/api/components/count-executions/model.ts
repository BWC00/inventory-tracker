import { Request } from 'express';
import { IUser } from '../users/model';

// Define the structure of a count execution
export interface ICountExecution {
	id: number;
	count_plan_id: number;
	status: string;
	created_at: Date;
}

// Define the structure of a user product count
export interface IUserProductCount {
	id: number;
	count_execution_id: number;
	barcode_scanner_id: number;
    user_id: number;
    quantity: number;
	created_at: Date;
}

// Define the structure of pricing information
export interface IPricing {
	product_id: number;
	category_id: number;
	price: number;
}


// Data Transfer Object (DTO) for a count execution
export class CountExecutionDTO {
    countPlanId: number;
    status: string;

    constructor(countPlanId?: number, status?: string) {
        this.countPlanId = countPlanId;
        this.status = status;
    }

	/**
	 * Convert the DTO instance to a string representation based on the specified format.
	 *
	 * @param format The format of the string representation ('insert' or 'update').
	 * @returns The string representation of the DTO instance.
	 */
	toString(format: 'insert'): string;
	toString(format: 'update'): string;
	toString(format: 'insert' | 'update'): string {
		if (format === 'insert') return `(count_plan_id, status) VALUES(${this.countPlanId}, '${this.status}')`;
		if (format === 'update') return `status = '${this.status}'`;
		return '';
	}

	/**
	 * Create a CountExecutionDTO instance from an Express request object.
	 *
	 * @param req The Express request object.
	 * @returns A new CountExecutionDTO instance created from the request.
	 */
	fromRequest(req: Request) {
		const { count_plan_id, status } = req.body;
		return new CountExecutionDTO(+count_plan_id, status);
	}
}

// Data Transfer Object (DTO) for a user product count
export class UserProductCountDTO {
	countExecutionId: number;
	barcodeScannerId: number;
    userId: number;
    quantity: number;

	constructor(countExecutionId?: number, barcodeScannerId?: number, userId?: number, quantity?: number) {
		this.countExecutionId = countExecutionId;
		this.barcodeScannerId = barcodeScannerId;
        this.userId = userId;
        this.quantity = quantity;
	}

	/**
	 * Convert the DTO instance to a string representation.
	 *
	 * @returns The string representation of the DTO instance.
	 */
	toString(): string {
		return `(count_execution_id, barcode_scanner_id, user_id, quantity)
				VALUES(${this.countExecutionId}, ${this.barcodeScannerId}, ${this.userId}, ${this.quantity})`;
	}

	/**
	 * Create a UserProductCountDTO instance from an Express request object.
	 *
	 * @param req The Express request object.
	 * @returns A new UserProductCountDTO instance created from the request.
	 */
	static fromRequest(req: Request) {
		const { id: userId } = req.user as IUser;
		const { id } = req.params
		const { barcode_scanner_id, quantity } = req.body;
		return new UserProductCountDTO(+id, +barcode_scanner_id, +userId, +quantity);
	}
}