import { Service, AbstractService, IService, Inject, IAny, ModelRecordID } from '../../src/index';
import { TasksModel } from '../model/tasks';

@Inject(['tasks'])
@Service('task_completer', 10)
export class TaskService extends AbstractService implements IService {

	protected tasks!: TasksModel;

	public async execute(): Promise<void> {
		const tasks: Array<IAny> = await this.tasks.find({ to_complete: true });
		tasks.forEach(async (task: any): Promise<void> => {
			await this.tasks.updateOne({ id: new ModelRecordID(task._id) }, { completed: true, to_complete: false });
		});
	}
}