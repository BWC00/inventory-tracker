import { Request } from 'express';

export interface IBarcodeScanner {
	id: number;
	subproduct_id: number;
	barcode: string;
	// created_at: Date;
}

export class BarcodeScannerDTO {
	subproductId: number;
	barcode: string;

	constructor(subproductId?: number, barcode?: string) {
		this.subproductId = subproductId;
		this.barcode = barcode;
	}

	toString(): string {
		return `(subproduct_id, barcode) VALUES(${this.subproductId}, '${this.barcode}')`;	
	}

	fromRequest(req: Request) {
		const { subproduct_id, barcode } = req.body;
		return new BarcodeScannerDTO(subproduct_id, barcode);
	}
}