import { IReturn } from '../interface/return';
import { ErrorMessages } from '../enum/error-messages';
import { IContext } from '../interface/context';
import { IOptions } from '../interface/options';
import { Logger } from './logger';
import { Threader } from './threader';
import { IAny } from '../interface/any';

/**
 * The Router class manages the actual requests coming in from the
 * various transports, HTTP and WS, and then routes them to the actual
 * controller and then executes them, the router is the middle man for
 * being able to queue, send to thread, or direct execution.
 */
export class Router {

	protected threader: Threader;
	protected logger: Logger;

	/**
	 * Creates a new router instance with the provided framework
	 * options, and exposes one main function called dispatch.
	 * 
	 * @param options The framework options.
	 */
	constructor(protected options: IOptions) {
		this.threader = new Threader();
		this.logger = new Logger();
	}

	public async dispatch(controller: IAny, route: IAny, context: IContext): Promise<void> {
		try {

			// Validate the endpoint.
			if (typeof controller.instance[route.methodName] === 'undefined') {
				throw new Error(ErrorMessages.ENDPOINT_NOT_FOUND);
			}

			// Execute the function.
			let response!: IReturn;
			if (controller.threaded === true) {
				const thread: any = this.threader.getThread(controller);
				response = await thread.execute(context);
			} else {
				response = await controller.instance[route.methodName](context);
			}

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