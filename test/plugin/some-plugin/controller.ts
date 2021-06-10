import { Controller, AbstractController, Route, IReturn, IOptions } from '../../../src/index';

@Controller('/plugin', 'plugin_app')
export class PluginController extends AbstractController {

	public options!: IOptions;

	@Route('GET', '/')
	public async index(): Promise<IReturn> {
		console.log(this.options);
		return { status: 200, content: 'Hello from a plugin!' };
	}
}
