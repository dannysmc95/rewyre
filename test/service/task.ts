import { WSHelper } from '../../src/helper/ws-helper';
import { Service, AbstractService, IService, Inject, ObjectID, State } from '../../src/index';
import { TasksModel } from '../model/tasks';
import { MiscProvider } from '../provider/misc';

@Inject(['tasks', 'misc'])
@Service('task_completer', 5)
export class TaskService extends AbstractService implements IService {

	protected websocket!: WSHelper;
	protected tasks!: TasksModel;
	protected misc!: MiscProvider;
	protected state!: State;

	public async execute(): Promise<void> {
		const tasks: Array<any> = await this.tasks.find({ to_complete: true });
		tasks.forEach(async (task: any): Promise<void> => {
			await this.tasks.updateOne({ _id: new ObjectID(task._id) }, { completed: true, to_complete: false });
		});
		this.websocket.broadcast(JSON.stringify({message: 'hello'}));
	}
}
