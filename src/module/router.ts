import { IReturn } from '../interface/return';
import { ErrorMessages } from '../enum/error-messages';
import { IContext } from '../interface/context';
import { IOptions } from '../interface/options';
import { Logger } from './logger';
import { IAny } from '../interface/any';

/**
 * The Router class manages the actual requests coming in from the
 * various transports, HTTP and WS, and then routes them to the actual
 * controller and then executes them, the router is the middle man for
 * being able to queue, send to thread, or direct execution.
 */
export class Router {

	protected logger: Logger;

	/**
	 * Creates a new router instance with the provided framework
	 * options, and exposes one main function called dispatch.
	 * 
	 * @param options The framework options.
	 */
	constructor(protected options: IOptions) {
		this.logger = new Logger();
	}

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
	public async dispatch(controller: IAny, route: IAny, context: IContext): Promise<void> {
		try {

			// Validate the endpoint.
			if (typeof controller.instance[route.methodName] === 'undefined') {
				throw new Error(ErrorMessages.ENDPOINT_NOT_FOUND);
			}

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
				context.getRaw().socket?.send(response.content);
			}

		} catch(err) {
			this.logger.error('ROUTER', err.message, err);
		}
	}
}