import { IContext } from '../interface/context';
import { WSHelper } from '../helper/ws-helper';
import { WSServer } from '../module/ws-server';

export class AbstractController {

	public models: any = {};
	public coreUserModel = '';
	public ws: WSHelper;

	constructor() {
		this.ws = new WSHelper();
	}

	public setAuthToken(context: IContext, token: string, optionString?: string): void {
		if (typeof optionString !== 'undefined') {
			if (context.raw.response) context.raw.response.setHeader('Set-Cookie', `Rewyre-Auth=${token}; ${optionString}`);
		} else {
			if (context.raw.response) context.raw.response.setHeader('Set-Cookie', `Rewyre-Auth=${token}; Path=/; SameSite=None;`);
		}
	}

	public setup(wsserver?: WSServer): void {
		this.ws.init(wsserver);
	}
}