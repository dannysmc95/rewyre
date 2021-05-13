import { Controller, AbstractController, Route, IReturn, Inject, IContext, ModelRecordID } from '../../src/index';
import { TasksModel } from '../model/tasks';
import { UsersModel } from '../model/users';

@Inject(['tasks', 'users'])
@Controller('/api', 'api')
export class ApiController extends AbstractController {

	protected tasks!: TasksModel;
	protected users!: UsersModel;

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
		await this.tasks.deleteOne({ _id: new ModelRecordID(context.params.id) });
		return { status: 204 };
	}

	@Route('PATCH', '/task/complete/:id')
	public async complete(context: IContext): Promise<IReturn> {
		await this.tasks.updateOne({ _id: new ModelRecordID(context.params.id) }, { to_complete: true });
		return { status: 200 };
	}

	@Route('GET', '/users')
	public async user_index(): Promise<IReturn> {
		const users = await this.users.findOne({});
		return { status: 200, content: users };
	}

	@Route('GET', '/user')
	public async user_create(context: IContext): Promise<IReturn> {
		const newUser = {
			name: context.query.name,
			username: context.query.username,
			password: context.query.password,
		};
		await this.users.insertOne(newUser);
		return { status: 201 };
	}

	@Route('GET', '/user/multi')
	public async user_create_multi(context: IContext): Promise<IReturn> {
		const newUser1 = {
			name: context.query.name1,
			username: context.query.username1,
			password: context.query.password1,
		};
		const newUser2 = {
			name: context.query.name2,
			username: context.query.username2,
			password: context.query.password2,
		};
		await this.users.insertMany([newUser1, newUser2]);
		return { status: 201 };
	}

	@Route('GET', '/user/update')
	public async user_create_update(context: IContext): Promise<IReturn> {
		const newUser1 = {
			username: context.query.username,
		};
		await this.users.updateOne({name: 'Danny'}, newUser1);
		return { status: 201 };
	}

	@Route('GET', '/tasks/project')
	public async index_project(): Promise<IReturn> {
		const tasks = await this.users.find({}, { $projection: { username: 1 }});
		return { status: 200, content: tasks };
	}
}