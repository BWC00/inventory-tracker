import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { AbsController } from '../abstracts/controller';

import { IBarcodeScanner, BarcodeScannerDTO } from './model';
import { ISubproduct } from '../subproducts/model';
import { BarcodeScannerRepository } from './repository';
import { SubproductRepository } from '../subproducts/repository';

export class BarcodeScannerController extends AbsController<IBarcodeScanner, BarcodeScannerDTO, BarcodeScannerRepository> {

	/**
	 * BarcodeScannerController constructor.
	 * Initializes the necessary service and repository instances.
	 */
	private readonly subproductRepo: SubproductRepository = new SubproductRepository();

	constructor() {
		super('barcode_scanners', new BarcodeScannerRepository(), new BarcodeScannerDTO());
	}

	/**
	 * Create barcode scanners.
	 *
	 * URL: POST /barcode_scanners
	 * 
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			// Create a new BarcodeScannerDTO instance from the request
			const dto = this.tdto.fromRequest(req);

			// Read and check the corresponding subproduct for existence
			const subproduct: ISubproduct = await this.subproductRepo.read(dto.subproductId);
			if (!subproduct) {
				return res.status(404).json({ status: 404, error: `Subproduct not found` });
			}

			// Create a new barcode scanner using the repository
			const barcodeScanner: IBarcodeScanner = await this.repo.create(dto);

			// Return the created barcode scanner in the response
			return res.status(201).json(barcodeScanner);
		} catch (err) { 
			// Pass the error to the error handling middleware
			return next(err);
		}
	}
}