import { Model, AbstractModel } from '../../src/index';

@Model('users', 'user', {
	name: 'string',
	username: 'string',
	password: 'string',
}, 'mysql')
export class UsersModel extends AbstractModel {}