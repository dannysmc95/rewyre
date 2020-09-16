import { Controller, Route, AbstractController, IContext, IReturn } from '../../src/index';
import { render as Render } from 'mustache';
import { promises as fs } from 'fs';
import { resolve as Resolve } from 'path';

@Controller('/')
export class HomeController extends AbstractController {

	private wrapper: string = '';

	constructor() {
		super();
		fs.readFile(Resolve(__dirname, '../view/wrapper.html')).then((result: any) => {
			this.wrapper = result.toString();
		}).catch((err: any) => {
			throw new Error(err.message);
		});
	}

	@Route('GET', '/')
	public async home(context: IContext): Promise<IReturn> {
		const page_html: string = (await fs.readFile(Resolve(__dirname, '../view/index.html'))).toString();
		const rendered_page: string = Render(page_html, {});
		return { status: 200, content: Render(this.wrapper, { body_content: rendered_page }) };
	}
}