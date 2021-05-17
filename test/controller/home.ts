import { Controller, Route, IReturn, Inject, CryptoProvider } from '../../src/index';
import { CustomController } from '../abstract/controller';
import { MiscProvider } from '../provider/misc';

@Inject(['crypto', 'misc'])
@Controller('/', 'home')
export class HomeController extends CustomController {

	protected crypto!: CryptoProvider;
	protected misc!: MiscProvider;

	@Route('GET', '/')
	public async index(): Promise<IReturn> {
		this.misc.something();
		return { status: 200, content: this.render('index', {}, {title: 'To-Do Demo'}) };
	}
}