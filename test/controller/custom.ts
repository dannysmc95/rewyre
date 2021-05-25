import { Controller, AbstractController, Route, IReturn, Inject } from '../../src/index';
import { LogsModel } from '../model/logs';

@Inject(['logs'])
@Controller('/custom', 'api')
export class CustomController extends AbstractController {

	protected logs!: LogsModel;

	@Route('GET', '/')
	public async index(): Promise<IReturn> {
		const logs = await this.logs.find({});
		return { status: 200, content: logs };
	}
}
