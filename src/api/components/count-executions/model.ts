import { Request } from 'express';
import { IUser } from '../users/model';

export interface ICountExecution {
	id: number;
	count_plan_id: number;
	status: string;
	created_at: Date;
}

export interface IUserProductCount {
	id: number;
	count_execution_id: number;
	barcode_scanner_id: number;
    user_id: number;
    quantity: number;
	created_at: Date;
}

// export interface IPricingByProduct {
// 	product_id: number;
// 	price: number;
// }

// export interface IPricingByCategory {
// 	category_id: number;
// 	price: number;
// }

export interface IPricing {
	product_id: number;
	category_id: number;
	price: number;
}


export class CountExecutionDTO {
    countPlanId: number;
    status: string;

    constructor(countPlanId?: number, status?: string) {
        this.countPlanId = countPlanId;
        this.status = status;
    }

	toString(format: 'insert'): string;
	toString(format: 'update'): string;
	toString(format: 'insert' | 'update'): string {
		if (format === 'insert') return `(count_plan_id, status) VALUES(${this.countPlanId}, '${this.status}')`;
		if (format === 'update') return `status = '${this.status}'`;
		return '';
	}

	fromRequest(req: Request) {
		const { count_plan_id, status } = req.body;
		return new CountExecutionDTO(+count_plan_id, status);
	}
}

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

	toString(): string {
		return `(count_execution_id, barcode_scanner_id, user_id, quantity)
				VALUES(${this.countExecutionId}, ${this.barcodeScannerId}, ${this.userId}, ${this.quantity})`;
	}

	static fromRequest(req: Request) {
		const { id: userId } = req.user as IUser;
		const { id } = req.params
		const { barcode_scanner_id, quantity } = req.body;
		return new UserProductCountDTO(+id, +barcode_scanner_id, +userId, +quantity);
	}
}