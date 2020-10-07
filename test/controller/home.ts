import { Controller, Route, IReturn, Inject, CryptoProvider } from '../../src/index';
import { CustomController } from '../abstract/controller';

@Inject(['crypto'])
@Controller('/', 'home')
export class HomeController extends CustomController {

	protected crypto!: CryptoProvider;

	@Route('GET', '/')
	public async index(): Promise<IReturn> {
		return { status: 200, content: this.render('index', {}, {title: 'To-Do Demo'}) };
	}
}