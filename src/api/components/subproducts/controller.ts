import { AbsController } from '../abstracts/controller';

import { ISubproduct, SubproductDTO } from './model';
import { SubproductRepository } from './repository';

export class SubproductController extends AbsController<ISubproduct, SubproductDTO, SubproductRepository> {
	constructor() {
		super('subproducts', new SubproductRepository(), new SubproductDTO());
	}
}