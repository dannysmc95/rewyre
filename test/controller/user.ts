import { Controller, AbstractController, Route, IReturn, Inject, IContext } from '../../src/index';
import { UsersModel } from '../model/users';

@Inject(['users'])
@Controller('/user', 'users')
export class UserController extends AbstractController {

	protected users!: UsersModel;

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
