import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { AbsController } from '../abstracts/controller';

import { ICountExecution, IPricing, CountExecutionDTO, UserProductCountDTO } from './model';
import { IBarcodeScanner } from '../barcode-scanners/model';

import { CountExecutionRepository } from './repository';
import { BarcodeScannerRepository } from '../barcode-scanners/repository';

export class CountExecutionController extends AbsController<ICountExecution, CountExecutionDTO, CountExecutionRepository> {
	private readonly barcodeScannerRepo: BarcodeScannerRepository = new BarcodeScannerRepository();

	constructor() {
		super('countexecutions', new CountExecutionRepository(), new CountExecutionDTO());
	}

	/**
	 * Get total pricing, pricing per product or pricing per category of a count execution
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async getPricing(req: Request, res: Response, next: NextFunction) {
		try {	
			const { id } = req.params;
			const { order_by } = req.query;

			// Read the count execution and check for its existence and if it is still ongoing
			const countExecution = await this.repo.read(+id);
			if (!countExecution) {
				return res.status(404).json({ status: 404, error: 'Count execution not found' });
			} else if (countExecution.status == 'ongoing') {
				return res.status(403).json({status: 403, error: 'Count execution is still ongoing' });
			}

			let pricing: IPricing[] | IPricing;

			// Retrieve pricing based on the specified order_by parameter
			switch(order_by) {
				case 'product':
					pricing = await this.repo.getPricingByProduct(+id);
					break;
				case 'category':
					pricing = await this.repo.getPricingByCategory(+id);
					break;
				default:
					pricing = await this.repo.getPricing(+id);
			}

			return res.status(200).json(pricing)
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Add user product counts to an ongoing countexecution
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async addUserProductCount(req: Request, res: Response, next: NextFunction) {
		try {
			// Create a UserProductCountDTO instance from the request
			const dto = UserProductCountDTO.fromRequest(req);

			// Read the count execution and check for its existence and if it ended
			const countExecution = await this.repo.read(dto.countExecutionId);
			if (!countExecution) {
				return res.status(404).json({ status: 404, error: 'Count execution not found' });
			} else if (countExecution.status == 'end') {
				return res.status(403).json({status: 403, error: 'Count execution ended' });
			}

			// Read the barcode scanner and check for its existence
			const barcodeScanner: IBarcodeScanner = await this.barcodeScannerRepo.read(dto.barcodeScannerId);
			if (!barcodeScanner) {
				return res.status(404).json({ status: 404, error: `Barcode scanner not found` });
			}

			// Add the user product count
			const userProductCount = await this.repo.addUserProductCount(dto);

			return res.status(201).send(userProductCount);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Delete an ended count execution
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;

			// Read the count execution and check for its existence and if it is still ongoing
			const countExecution = await this.repo.read(+id);
			if (!countExecution) {
				return res.status(404).json({ status: 404, error: 'Count execution not found' });
			} else if (countExecution.status == 'ongoing') {
				return res.status(403).json({status: 403, error: 'Count execution is still ongoing' });
			}
			
			// Delete the count execution
			await this.repo.delete(+id);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}