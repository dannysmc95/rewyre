import { Provide, AbstractProvider, Logger, Inject } from '../../src/index';
import { TasksModel } from '../model/tasks';

@Inject(['tasks'])
@Provide('misc', 'shared')
export class MiscProvider extends AbstractProvider {

	protected logger: Logger;
	public tasks!: TasksModel;

	public constructor() {
		super();
		this.logger = new Logger();
	}

	public getLogger(): Logger {
		return this.logger;
	}

	public async something(): Promise<void> {
		console.log(await this.tasks.count({}));
	}
}