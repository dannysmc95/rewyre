import { Controller, AbstractController, Route, IReturn } from '../../../src/index';

@Controller('/plugin', 'plugin_app')
export class PluginController extends AbstractController {

	@Route('GET', '/')
	public async index(): Promise<IReturn> {
		return { status: 200, content: 'Hello from a plugin!' };
	}
}
