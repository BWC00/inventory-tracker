import { AbsRepository } from '../abstracts/repository';

import { IBarcodeScanner, BarcodeScannerDTO } from './model';

export class BarcodeScannerRepository extends AbsRepository<IBarcodeScanner, BarcodeScannerDTO> {
	constructor() {
		super('barcode_scanners');
	}
}