import { AbstractController } from '../../src/index';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { render } from 'mustache';

export class CustomController extends AbstractController {

	protected wrapper: string;

	public constructor() {
		super();
		this.wrapper = readFileSync(resolve(__dirname, '../view/wrapper.html'), 'utf-8');
	}

	protected render(view: string, data: any, context: any = {}): string {
		const page_html: string = readFileSync(resolve(__dirname, `../view/${view}.html`), 'utf-8');
		const rendered_page: string = render(page_html, data);
		return render(this.wrapper, Object.assign({ body: rendered_page }, context));
	}
}