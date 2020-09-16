import { IContext } from '..';

export class AbstractController {
	public models: any = {};
	public coreUserModel = '';

	public setAuthToken(context: IContext, token: string, optionString?: string): void {
		if (typeof optionString !== 'undefined') {
			context.raw.response.setHeader('Set-Cookie', `Rewyre-Auth=${token}; ${optionString}`);
		} else {
			context.raw.response.setHeader('Set-Cookie', `Rewyre-Auth=${token}; Path=/; SameSite=None;`);
		}
	}
}