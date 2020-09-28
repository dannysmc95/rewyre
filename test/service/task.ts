import { Service, AbstractService, IService, Inject, IAny, ModelRecordID, Logger } from '../../src/index';
import { TasksModel } from '../model/tasks';
import { MiscProvider } from '../provider/misc';

@Inject(['tasks', 'misc'])
@Service('task_completer', 10)
export class TaskService extends AbstractService implements IService {

	protected tasks!: TasksModel;
	protected misc!: MiscProvider;

	public async execute(): Promise<void> {
		const logger: Logger = this.misc.getLogger();
		const tasks: Array<IAny> = await this.tasks.find({ to_complete: true });
		tasks.forEach(async (task: any): Promise<void> => {
			await this.tasks.updateOne({ _id: new ModelRecordID(task._id) }, { completed: true, to_complete: false });
			logger.notice('TASK:SERVICE', `Set completed status for task: ${task._id}.`);
		});
	}
}