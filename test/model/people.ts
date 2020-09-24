import { Model, AbstractModel } from '../../src/index';

@Model('people', 'user', {
	name: 'string',
	position: 'string',
	created: 'number',
	updated: 'number',
})
export class PeopleModel extends AbstractModel {}