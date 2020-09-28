import { Controller, Route, IReturn } from '../../src/index';
import { CustomController } from '../abstract/controller';

@Controller('/', 'home')
export class HomeController extends CustomController {

	@Route('GET', '/')
	public async index(): Promise<IReturn> {
		return { status: 200, content: this.render('index', {}, {title: 'To-Do Demo'}) };
	}
}