import { Model, AbstractModel } from '../../src/index';

@Model('tasks', 'general', {
	name: 'string',
	description: 'string',
	completed: 'boolean',
	updated: 'number',
})
export class TasksModel extends AbstractModel {}