import { Controller, AbstractController, Route, IReturn } from '../../src/index';

@Controller('/', 'home')
export class HomeController extends AbstractController {

	@Route('GET', '/')
	public async index(): Promise<IReturn> {
		return { status: 200, content: 'Hello, World!' };
	}
}