import { AbstractProvider } from '../abstract/provider';
import { Request } from 'express';
import { Provide } from '../decorator/provide';

/**
 * The auth provider is a series of authentication related helper methods,
 * that span from auth token validation, token generation, and more. This
 * class's sole purpose is to offer helper functions, you can extend it to
 * add more functionality if required or more custom method.
 */
@Provide('auth', 'single')
export class AuthProvider extends AbstractProvider {

	protected token_name: string = 'Rewyre-Auth-Token';

	/**
	 * Will set the token's name to the one provided, this will affect
	 * all subsequent calls to use the given token name to search for.
	 * 
	 * @param token_name The token to search.
	 */
	public setTokenName(token_name: string) {
		this.token_name = token_name;
	}

	/**
	 * This method will attempt to get the authentication token from the
	 * given request object, if the token is found it will be returned
	 * otherwise it will return false.
	 * 
	 * @param request The request object from IContext.
	 */
	public getToken(request: Request): string | false {
		if (
			typeof request.headers[this.token_name] !== 'undefined' &&
			request.headers[this.token_name] !== '' &&
			String(request.headers[this.token_name]).length > 0
		) {
			return String(request.headers[this.token_name]);
		} else {
			return false;
		}
	}
}