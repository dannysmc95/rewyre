import { Request } from 'express';
import { IGuard } from '../interface/guard';
import { Logger } from '../module/logger';

/**
 * The abstract guard class is the default guard authenticator that uses the standard
 * rewyre authentication methods, which checks for the X-Rewyre-Token header and will
 * validate based on that. Please note this guard can be injected with models and any
 * provider. All functions can be overridden, and if you want/need to use any method
 * from the extending class, then you can do `super.<method>()`. Please remember guards
 * are defined as an array, and will be called one after another, so try not to put very
 * complex code into the supports function, we suggest just checking for a specific token
 * or even add a special header to trigger it.
 * 
 * PLEASE NOTE:
 * This guard does NOT do ANY REAL validation, and is there simply as a base class you
 * can use, this will log all the required information and allow you to understand how
 * the functionality works, if you want to use this guard, then you can extend it and
 * update the getUser and checkCredentials methods with legitimate verification.
 */
export abstract class AbstractGuard implements IGuard {

	protected logger: Logger;
	protected token_name = 'X-Rewyre-Token';

	/**
	 * Creates an instance of the of the guard class, that can be used with
	 * the internal authentication module.
	 */
	constructor() {
		this.logger = new Logger();
	}

	/**
	 * This method is called for each request, and will return a boolean
	 * value as to whether this guard is supported by the current context,
	 * so if you have an application that supports external authentication
	 * alongside a local user model authentication, then you can use the
	 * below function to check whether you want this guard to run for the
	 * given context, return true or false respectively.
	 * 
	 * @param request The request object.
	 */
	public async supports(request: Request): Promise<boolean> {
		if (typeof request.headers[this.token_name] !== 'undefined' && request.headers[this.token_name] !== 'undefined') {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * This function is called if the supports method returns true, and this
	 * function should return the required header token and any other data by
	 * default it will return an object defining the token, but you can add
	 * additional information, which will passed to the additional methods.
	 * 
	 * @param request The request object.
	 */
	public async getCredentials(request: Request): Promise<any> {
		return {
			token: (typeof request.headers[this.token_name] !== 'undefined' ? request.headers[this.token_name] : 'NO_VALID_TOKEN'),
		};
	}

	/**
	 * This function should either call the model, or an external API to get
	 * the user relating to this request, if available, if no user is available
	 * then you can return an empty object, as it is not required. Return false
	 * if this function fails, and this will trigger the onAuthenticationFailure
	 * event.
	 * 
	 * @param credentials The credentials related to the request.
	 */
	public async getUser(credentials: any): Promise<any> {
		return { token: credentials.token };
	}

	/**
	 * This function is called after getUser and will allow you to any required
	 * verification of a password, or a token, this is where you will actually
	 * do any validation for the request and credentials, here you will return a
	 * true or false depending on the outcome, false will trigger the authentication
	 * failure and true will trigger the authentication success.
	 * 
	 * @param request The request object.
	 * @param credentials The credentials for the request.
	 * @param user The returned user object.
	 */
	public async checkCredentials(request: Request, credentials: any, user: any): Promise<boolean> {
		if (credentials.token !== '' && user.token !== '') return true;
		return false;
	}

	/**
	 * This function is called depending on the outcome of the checkCredentials
	 * or getUser function and does not have any kind of response, you can use
	 * this to set information about a user and their credentials, maybe remove
	 * a temporary token from the database, this is essentially a cleanup task
	 * that is run before proceeding.
	 * 
	 * @param request The request object.
	 * @param credentials The credentials for the request.
	 * @param user The user relating to the request, if available.
	 */
	public async onAuthenticationSuccess(request: Request, credentials: any, user: any): Promise<void> {
		this.logger.notice('GUARD', `Authentication success for token: ${credentials.token}:${user.token}.`);
	}

	/**
	 * This function is called depending on the outcome of the checkCredentials
	 * and getUser functions, if either respond with a false or null, then this
	 * function is called. This has no response but can be used to increment the
	 * failed login attempts or even block a user if required.
	 * 
	 * @param request The request object.
	 * @param credentials The credentials for the request.
	 */
	public async onAuthenticationFailure(request: Request, credentials: any, user?: any): Promise<void> {
		this.logger.warn('GUARD', `Authentication failure for the following token: ${credentials.token} and user data: ${JSON.stringify(user)}.`);
	}
}