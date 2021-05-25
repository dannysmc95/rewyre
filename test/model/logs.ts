import { Model, AbstractModel } from '../../src/index';

@Model('logs', 'general', {
	name: 'string',
	description: 'string',
}, 'file')
export class LogsModel extends AbstractModel {}
