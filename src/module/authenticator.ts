import { IContext } from '../interface/context';
import { IGuard } from '../interface/guard';
import { Request } from 'express';
import { ILogger } from '../interface/logger';

/**
 * The authenticator class is a module for rewyre that manages guards
 * and how they are initialised and executed as part of the built-in
 * authentication flows, the authenticator also pairs with decorators
 * that support the authentication flow.
 */
export class Authenticator {

	/**
	 * Creates an instance of the authenticator class in preparation to
	 * be called from inside of the router to manage authentication for
	 * all routes.
	 * 
	 * @param guards The array of available guards.
	 * @param logger The logger instance.
	 * @returns Authenticator.
	 */
	public constructor(protected guards: Array<any>, protected logger: ILogger) {}

	/**
	 * This function takes the controller, route and context, in which it
	 * will then loop and find available guards that match this request,
	 * or fallback to an available guard, if defined.
	 * 
	 * @param controller The controller object.
	 * @param route The route object.
	 * @param context The request context.
	 * @returns Promise<boolean>.
	 */
	public async process(context: IContext): Promise<boolean> {
		try {

			// Now let's find an available guard.
			this.logger.verbose('GUARD', 'Received guard request.');
			const guard: IGuard | null = await this.findGuardMatch(context.getRaw().request);

			// If guard is not null, then return true as no guard available so allow requests.
			if (guard === null) {
				this.logger.verbose('GUARD', 'No guard available, allowing connection.');
				return true;
			}

			// Now let's process the guard steps.
			this.logger.verbose('GUARD', 'Guard found, getting credentials.');
			const credentials: any = await guard.getCredentials(context.getRaw().request);

			// Now get the user related to this guard.
			this.logger.verbose('GUARD', 'Getting user from request.');
			const user: any = await guard.getUser(credentials);
			if (user === false) {
				this.logger.verbose('GUARD', 'No user received, rejecting.');
				await guard.onAuthenticationFailure(context.getRaw().request, credentials);
				if (context.type === 'http') {
					context.getRaw().response?.status(401).end();
				} else {
					context.getRaw().socket?.send(JSON.stringify({
						command: 'unauthorised',
						content: {
							code: 401,
							message: 'Unauthorised',
						},
					}));
				}
				return false;
			}

			// Check the validatity of the credentials.
			this.logger.verbose('GUARD', 'Validating credentials.');
			const verified: boolean = await guard.checkCredentials(context.getRaw().request, credentials, user);
			if (verified === false) {
				this.logger.verbose('GUARD', 'Credentials failed, rejecting.');
				await guard.onAuthenticationFailure(context.getRaw().request, credentials, user);
				if (context.type === 'http') {
					context.getRaw().response?.status(401).end();
				} else {
					context.getRaw().socket?.send(JSON.stringify({
						command: 'unauthorised',
						content: {
							code: 401,
							message: 'Unauthorised',
						},
					}));
				}
				return false;
			}

			// If validation succeeds, assign the authentication object, call the success event and return true.
			this.logger.verbose('GUARD', 'Guard check was successful, allowing.');
			context.authentication = user;
			await guard.onAuthenticationSuccess(context.getRaw().request, credentials, user);
			return true;

		} catch(err) {
			this.logger.error('GUARD', 'There was an error with running the guard.', err as Error);
			if (context.type === 'http') {
				context.getRaw().response?.status(500).end();
			} else {
				context.getRaw().socket?.send(JSON.stringify({
					command: 'server_error',
					content: {
						status: 500,
						message: 'Internal Server Error',
					},
				}));
			}
			return false;
		}
	}

	/**
	 * This method loops the available guards and attempts to find a supported
	 * or reverts to the fallback if available.
	 * 
	 * @param request The request object.
	 * @returns IGuard | null.
	 */
	protected async findGuardMatch(request: Request): Promise<IGuard | null> {

		// Define the fallback guard.
		let fallbackGuard: IGuard | null = null;

		// Loop the guards.
		for (const index in this.guards) {

			// Define the guard, typed to help hints.
			const guard: IGuard = this.guards[index].instance;

			// Check whether the guard supports the request.
			const supportsGuard = await guard.supports(request);

			// If the guard is supported, return it.
			if (supportsGuard) return guard;

			// While looping, check for the fallback.
			if (this.guards[index].is_fallback) {
				fallbackGuard = this.guards[index].instance;
			}
		}

		// If we are here, then return the fallback guard (may be null).
		return fallbackGuard;
	}
}
