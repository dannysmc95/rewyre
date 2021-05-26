import { Controller, AbstractController, Route, IReturn, Inject, IContext, ObjectID } from '../../src/index';
import { TasksModel } from '../model/tasks';

@Inject(['tasks'])
@Controller('/api', 'api')
export class ApiController extends AbstractController {

	protected tasks!: TasksModel;

	@Route('GET', '/tasks')
	public async index(): Promise<IReturn> {
		const tasks = await this.tasks.find({});
		return { status: 200, content: tasks };
	}

	@Route('POST', '/task')
	public async create(context: IContext): Promise<IReturn> {
		const task = {
			name: context.body.name,
			description: context.body.description,
			to_complete: false,
			completed: false,
			updated: new Date().valueOf(),
		};
		await this.tasks.insertOne(task);
		return { status: 201 };
	}

	@Route('DELETE', '/task/:id')
	public async delete(context: IContext): Promise<IReturn> {
		await this.tasks.deleteOne({ _id: new ObjectID(context.params.id) });
		return { status: 204 };
	}

	@Route('PATCH', '/task/complete/:id')
	public async complete(context: IContext): Promise<IReturn> {
		await this.tasks.updateOne({ _id: new ObjectID(context.params.id) }, { to_complete: true });
		return { status: 200 };
	}
}
