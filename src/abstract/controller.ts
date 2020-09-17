import { IContext } from '../interface/context';
import { WSHelper } from '../helper/ws-helper';
import { WSServer } from '../module/ws-server';

/**
 * The abstract controller class is used as a base class for all controllers, this
 * can be extended with another custom controller first and then the final controller
 * extended by your custom controller, but always extend this class somehow, as the
 * abstract class adds the support for models, and WS controls.
 */
export class AbstractController {

	public models: any = {};
	public coreUserModel = '';
	public ws: WSHelper;

	constructor() {
		this.ws = new WSHelper();
	}

	/**
	 * Used to set an auth token cookie against the response.
	 * 
	 * @param context The request context.
	 * @param token The token to set.
	 * @param optionString The options to apply to the cookie.
	 */
	public setAuthToken(context: IContext, token: string, optionString?: string): void {
		if (typeof optionString !== 'undefined') {
			if (context.raw.response) context.raw.response.setHeader('Set-Cookie', `Rewyre-Auth=${token}; ${optionString}`);
		} else {
			if (context.raw.response) context.raw.response.setHeader('Set-Cookie', `Rewyre-Auth=${token}; Path=/; SameSite=None;`);
		}
	}

	/**
	 * Used internally to assign the websocket server instance.
	 * 
	 * @param wsserver The WSServer instance.
	 */
	public setup(wsserver?: WSServer): void {
		this.ws.init(wsserver);
	}
}