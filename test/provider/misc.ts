import { Provide, AbstractProvider, Inject } from '../../src/index';
import { TasksModel } from '../model/tasks';

@Inject(['tasks'])
@Provide('misc', 'shared')
export class MiscProvider extends AbstractProvider {

	public tasks!: TasksModel;

	public constructor() {
		super();
	}

	public async something(): Promise<void> {
		console.log(await this.tasks.count({}));
	}
}
