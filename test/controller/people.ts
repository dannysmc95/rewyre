import { Controller, AbstractController, Route, IContext, IReturn, InjectModel, ModelRecordID } from '../../src/index';
import { render as Render } from 'mustache';
import { promises as fs } from 'fs';
import { resolve as Resolve } from 'path';

@Controller('/people')
@InjectModel('people')
export class PeopleController extends AbstractController {

	private wrapper = '';

	constructor() {
		super();
		fs.readFile(Resolve(__dirname, '../view/wrapper.html')).then((result: any) => {
			this.wrapper = result.toString();
		}).catch((err: any) => {
			throw new Error(err.message);
		});
	}

	@Route('GET', '/')
	public async list(): Promise<IReturn> {
		const page_html: string = (await fs.readFile(Resolve(__dirname, '../view/people/list.html'))).toString();
		const people: Array<any> = await this.models.people.find({});
		const rendered_page: string = Render(page_html, { people: people });
		this.ws.broadcast('people/audit', {entry: 'List page was accessed.'});
		return { status: 200, content: Render(this.wrapper, { body_content: rendered_page }) };
	}

	@Route('GET', '/add')
	public async add(): Promise<IReturn> {
		const page_html: string = (await fs.readFile(Resolve(__dirname, '../view/people/add.html'))).toString();
		const rendered_page: string = Render(page_html, {});
		this.ws.broadcast('people/audit', {entry: 'Add page was accessed.'});
		return { status: 200, content: Render(this.wrapper, { body_content: rendered_page }) };
	}

	@Route('GET', '/audit')
	public async audit(): Promise<IReturn> {
		const page_html: string = (await fs.readFile(Resolve(__dirname, '../view/people/audit.html'))).toString();
		const rendered_page: string = Render(page_html, {});
		this.ws.broadcast('people/audit', {entry: 'Audit page was accessed.'});
		return { status: 200, content: Render(this.wrapper, { body_content: rendered_page }) };
	}

	@Route('POST', '/api/insert')
	public async insert(context: IContext): Promise<IReturn> {
		await this.models.people.insertOne(context.body);
		const page_html: string = (await fs.readFile(Resolve(__dirname, '../view/people/redirect.html'))).toString();
		this.ws.broadcast('people/audit', {entry: 'API: Insertion to people collection.'});
		return { status: 200, content: page_html };
	}

	@Route('GET', '/api/delete/:id')
	public async delete(context: IContext): Promise<IReturn> {
		await this.models.people.deleteOne({ _id: new ModelRecordID(context.params.id) });
		const page_html: string = (await fs.readFile(Resolve(__dirname, '../view/people/redirect.html'))).toString();
		this.ws.broadcast('people/audit', {entry: 'API: Deletion from people collection.'});
		return { status: 200, content: page_html };
	}
}