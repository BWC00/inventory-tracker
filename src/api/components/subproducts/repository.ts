import { AbsRepository } from '../abstracts/repository';

import { ISubproduct, SubproductDTO } from './model';

export class SubproductRepository extends AbsRepository<ISubproduct, SubproductDTO> {
	constructor() {
		super('subproducts');
	}
}