import { Service, AbstractService, IService, Inject, ModelRecordID, Logger, State } from '../../src/index';
import { TasksModel } from '../model/tasks';
import { MiscProvider } from '../provider/misc';

@Inject(['tasks', 'misc'])
@Service('task_completer', 60)
export class TaskService extends AbstractService implements IService {

	protected tasks!: TasksModel;
	protected misc!: MiscProvider;
	protected state!: State;

	public async execute(): Promise<void> {
		console.log(this.state.set('people', [{name: 'John Doe', position: 'Developer'}]));
		console.log(this.state.get('people'));
		const logger: Logger = this.misc.getLogger();
		const tasks: Array<any> = await this.tasks.find({ to_complete: true });
		tasks.forEach(async (task: any): Promise<void> => {
			await this.tasks.updateOne({ _id: new ModelRecordID(task._id) }, { completed: true, to_complete: false });
			logger.notice('TASK:SERVICE', `Set completed status for task: ${task._id}.`);
		});
	}
}