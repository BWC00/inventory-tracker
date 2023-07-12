import { Request } from 'express';

// Define the structure of a barcode scanner
export interface IBarcodeScanner {
	id: number;
	subproduct_id: number;
	barcode: string;
}

// Data Transfer Object (DTO) for a barcode scanner
export class BarcodeScannerDTO {
	subproductId: number;
	barcode: string;

	/**
	 * Construct a BarcodeScannerDTO instance.
	 *
	 * @param subproductId The ID of the associated subproduct.
	 * @param barcode The barcode string.
	 */
	constructor(subproductId?: number, barcode?: string) {
		this.subproductId = subproductId;
		this.barcode = barcode;
	}

	/**
	 * Convert the DTO instance to a string representation.
	 *
	 * @returns The string representation of the DTO instance.
	 */
	toString(): string {
		return `(subproduct_id, barcode) VALUES(${this.subproductId}, '${this.barcode}')`;	
	}

	/**
	 * Create a BarcodeScannerDTO instance from an Express request.
	 *
	 * @param req The Express request object.
	 * @returns A new BarcodeScannerDTO instance created from the request.
	 */
	fromRequest(req: Request) {
		const { subproduct_id, barcode } = req.body;
		return new BarcodeScannerDTO(subproduct_id, barcode);
	}
}