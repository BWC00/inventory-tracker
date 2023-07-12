import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { AbsController } from '../abstracts/controller';

import { IBarcodeScanner, BarcodeScannerDTO } from './model';
import { ISubproduct } from '../subproducts/model';
import { BarcodeScannerRepository } from './repository';
import { SubproductRepository } from '../subproducts/repository';

export class BarcodeScannerController extends AbsController<IBarcodeScanner, BarcodeScannerDTO, BarcodeScannerRepository> {
	private readonly subproductRepo: SubproductRepository = new SubproductRepository();

	constructor() {
		super('barcode_scanners', new BarcodeScannerRepository(), new BarcodeScannerDTO());
	}

	@bind
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const dto = this.tdto.fromRequest(req);

			const subproduct: ISubproduct = await this.subproductRepo.read(dto.subproductId);
			if (!subproduct) {
				return res.status(404).json({ status: 404, error: `Subproduct not found` });
			}

			const barcodeScanner: IBarcodeScanner = await this.repo.create(dto);

			return res.status(201).json(barcodeScanner);
		} catch (err) { 
			return next(err);
		}
	}
}