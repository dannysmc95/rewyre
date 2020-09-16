import { Model, AbstractModel } from '../../src/index';

@Model('people', {
	name: 'string',
	postcode: 'string',
	dob: 'string',
	position: 'string',
})
export class PeopleModel extends AbstractModel {}