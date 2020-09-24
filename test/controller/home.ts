import { Controller, AbstractController, Route, IReturn, Inject } from '../../src/index';
import { PeopleModel } from '../model/people';
import { TestProvider } from '../provider/test';

@Inject(['people', 'test'])
@Controller('/', 'home')
export class HomeController extends AbstractController {

	protected people!: PeopleModel;
	protected test!: TestProvider;

	@Route('GET', '/')
	public async index(): Promise<IReturn> {
		this.test.test();
		return { status: 200, content: 'Hello, World!' };
	}

	@Route('GET', '/people')
	public async get_people(): Promise<IReturn> {
		const people: any = await this.people.find({});
		return { status: 200, content: people };
	}
}