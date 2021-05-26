import { IReturn } from '../interface/return';
import { ErrorMessages } from '../enum/error-messages';
import { IContext } from '../interface/context';
import { IOptions } from '../interface/options';
import { Authenticator } from './authenticator';
import { ILogger } from '../interface/logger';

/**
 * The Router class manages the actual requests coming in from the
 * various transports, HTTP and WS, and then routes them to the actual
 * controller and then executes them, the router is the middle man for
 * being able to queue, send to thread, or direct execution.
 */
export class Router {

	/**
	 * Creates a new router instance with the provided framework
	 * options, and exposes one main function called dispatch.
	 * 
	 * @param options The framework options.
	 */
	public constructor(protected options: IOptions, protected authenticator: Authenticator, protected logger: ILogger) {}

	/**
	 * The dispatch method is the key part of executing the actual
	 * methods from the classes, this takes events from both the WS
	 * and HTTP server and places them in a single function, this way
	 * the framework can also offer functionality for executing methods
	 * in a different thread and also managing the response and where
	 * and how to send that back to the client.
	 * 
	 * @param controller The controller definition.
	 * @param route The route definition.
	 * @param context The context from the HTTP/WS server.
	 */
	public async dispatch(controller: any, route: any, context: IContext): Promise<void> {
		this.logger.verbose('ROUTER', `Received routing request for: ${String(controller.prefix + controller.route).replace('//', '/')}.`);
		try {

			// Validate the endpoint.
			if (typeof controller.instance[route.methodName] === 'undefined') {
				this.logger.verbose('ROUTER', `No endpoint found for ${String(controller.prefix + controller.route).replace('//', '/')}.`);
				throw new Error(ErrorMessages.ENDPOINT_NOT_FOUND);
			}

			// Execute authenticator, if false, then stop processing.
			const authStatus: boolean = await this.authenticator.process(context);
			if (!authStatus) return;

			// Execute the function.
			const response: IReturn = await controller.instance[route.methodName](context);

			// Check for response management.
			if (context.type === 'http') {
				if (typeof response.content === 'string') {
					context.getRaw().response?.status(response.status).send(response.content);
				} else {
					context.getRaw().response?.status(response.status).json(response.content);
				}
			} else {
				context.getRaw().socket?.send(JSON.stringify({
					command: context.query.ws_command,
					content: response.content,
				}));
			}

		} catch(err) {
			this.logger.verbose('ROUTER', 'There was an error calling the route.', err);
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
		}
	}
}
