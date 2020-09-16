import { Controller, AbstractController, Route, IContext, IReturn, InjectModel, ModelRecordID } from '../../src/index';
import { render as Render } from 'mustache';
import { promises as fs } from 'fs';
import { resolve as Resolve } from 'path';

@Controller('/people')
@InjectModel('people')
export class PeopleController extends AbstractController {

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
	public async list(context: IContext): Promise<IReturn> {
		const page_html: string = (await fs.readFile(Resolve(__dirname, '../view/people/list.html'))).toString();
		const people: Array<any> = await this.models.people.find({});
		const rendered_page: string = Render(page_html, { people: people });
		return { status: 200, content: Render(this.wrapper, { body_content: rendered_page }) };
	}

	@Route('GET', '/add')
	public async add(context: IContext): Promise<IReturn> {
		const page_html: string = (await fs.readFile(Resolve(__dirname, '../view/people/add.html'))).toString();
		const rendered_page: string = Render(page_html, {});
		return { status: 200, content: Render(this.wrapper, { body_content: rendered_page }) };
	}

	@Route('POST', '/api/insert')
	public async insert(context: IContext): Promise<IReturn> {
		await this.models.people.insertOne(context.body);
		const page_html: string = (await fs.readFile(Resolve(__dirname, '../view/people/redirect.html'))).toString();
		return { status: 200, content: page_html };
	}

	@Route('GET', '/api/delete/:id')
	public async delete(context: IContext): Promise<IReturn> {
		await this.models.people.deleteOne({ _id: new ModelRecordID(context.params.id) });
		const page_html: string = (await fs.readFile(Resolve(__dirname, '../view/people/redirect.html'))).toString();
		return { status: 200, content: page_html };
	}
}