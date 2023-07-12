import { AbsController } from '../abstracts/controller';

import { ICategory, CategoryDTO } from './model';
import { CategoryRepository } from './repository';

export class CategoryController extends AbsController<ICategory, CategoryDTO, CategoryRepository> {
	constructor() {
		super('categories', new CategoryRepository(), new CategoryDTO());
	}
}