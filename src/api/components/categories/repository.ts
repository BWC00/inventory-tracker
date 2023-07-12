import { AbsRepository } from '../abstracts/repository';

import { ICategory, CategoryDTO } from './model';

export class CategoryRepository extends AbsRepository<ICategory, CategoryDTO> {
	constructor() {
		super('categories');
	}
}