import { Model, AbstractModel } from '../../src/index';

@Model('tasks', 'general', {
	name: 'string',
	description: 'string',
	to_complete: 'boolean',
	completed: 'boolean',
	updated: 'number',
})
export class TasksModel extends AbstractModel {}