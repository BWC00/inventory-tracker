import { Request } from 'express';
import { IUser } from '../users/model';

export interface ICountPlan {
	id: number;
	owner_id: number;
	repetition_schedule: string;
	created_at: Date;
}

export class CountPlanDTO {
	ownerId: number;
	repetitionSchedule: string;

	constructor(ownerId?: number, repetitionSchedule?: string) {
		this.ownerId = ownerId;
		this.repetitionSchedule = repetitionSchedule;
	}

	/**
	 * Convert the CountPlanDTO object to a string representation for insertion or update in the database
	 * @param format The format type: 'insert' for insertion, 'update' for update
	 * @returns A string representation of the CountPlanDTO object
	 */
	toString(format: 'insert'): string;
	toString(format: 'update'): string;
	toString(format: 'insert' | 'update'): string {
		if (format === 'insert') return `(owner_id, repetition_schedule) VALUES(${this.ownerId}, '${this.repetitionSchedule}')`;
	}

	/**
	 * Create a CountPlanDTO object from the Express request object
	 * @param req The Express request object
	 * @returns A new instance of CountPlanDTO
	 */
	fromRequest(req: Request) {
		const { id } = req.user as IUser;
		const { repetition_schedule } = req.body;
		return new CountPlanDTO(+id, repetition_schedule);
	}
}