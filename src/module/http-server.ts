import { IOptions } from '../interface/options';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { normalize } from 'path';
import { ServerHelper } from '../helper/server';
import { Router } from './router';
import { IContext } from '../interface/context';
import { ILogger } from '../interface/logger';

/**
 * The HTTPServer is the wrapper around the express server,
 * this manages all controllers in the context of the HTTP
 * server, and manages basic control of the HTTP server.
 */
export class HTTPServer {

	protected helper: ServerHelper;
	protected server: express.Application;
	protected controllers!: Array<any>;

	/**
	 * Creates an instance of the HTTPServer, with the framework options,
	 * from here this will be able to manipulate and manage the HTTP server.
	 * 
	 * @param options The framework options.
	 */
	public constructor(protected options: IOptions, protected router: Router, protected logger: ILogger) {
		this.helper = new ServerHelper();
		this.server = express();
		this.setupDefaultMiddleware();
	}

	/**
	 * Returns the instance of the Express server.
	 */
	public getInstance(): express.Application {
		return this.server;
	}

	/**
	 * This function is a simple proxy to the internal express server's
	 * use function which allows you to apply middleware, including plugins,
	 * middleware functions and more.
	 * 
	 * @param middleware The middleware function.
	 */
	public useProxy(middleware: (request: express.Request, response: express.Response, next: express.NextFunction) => void): void {
		this.server.use(middleware);
	}

	/**
	 * This function proxies the express.static functionality to allow the
	 * use of creating static directories to serve, this could be downloads,
	 * assets for a webpage, or something else.
	 * 
	 * @param folder_path The folder path.
	 * @param url_path The URL path.
	 */
	public useStaticProxy(folder_path: string, url_path?: string): void {
		if (url_path) {
			this.server.use(url_path, express.static(folder_path));
		} else {
			this.server.use(express.static(folder_path));
		}
	}

	/**
	 * This method will tell Express to start listening on the
	 * given port and hostname inside of the framework options.
	 */
	public start(): void {
		this.server.listen(this.options.port);
	}

	/**
	 * Accepts the controllers and models from the framework, then
	 * processes them and creates usable routes for the router to
	 * call upon when required.
	 * 
	 * @param controllers The array of controllers.
	 * @param models The array of models.
	 */
	public process(controllers: Array<any>): void {
		this.controllers = controllers;
		this.buildRoutes();
	}

	/**
	 * Loops through the routes, and builds the desired route, specifically
	 * for the HTTP server's context, it will then create a function that
	 * will call the dispatch method of the router, which will actually do
	 * the processing and error catching for that route.
	 */
	protected buildRoutes(): void {
		this.controllers.forEach((controller: any) => {
			this.logger.verbose('HTTP', `Building controller for prefix: ${controller.prefix}.`);
			controller.routes.forEach((route: any) => {
				this.logger.verbose('HTTP', `Building route for: ${route.path}.`);

				// Create the express route.
				this.server[route.requestMethod](normalize(controller.prefix + route.path), (request: express.Request, response: express.Response) => {

					// Build a context.
					const context: IContext = {
						type: 'http',
						ipAddress: request.socket.remoteAddress || '',
						headers: this.helper.convertObject(request.headers),
						cookies: this.helper.convertObject(request.cookies),
						params: this.helper.convertObject(request.params),
						query: this.helper.convertObject(request.query),
						body: request.body,
						authentication: false,
						getRaw: () => {
							return {
								request: request,
								response: response,
							};
						},
					};

					// Pass to the dispatcher.
					this.router.dispatch(controller, route, context);
				});
			});
		});
	}

	/**
	 * Internal function that defines all the default middleware we
	 * require for the application, this includes a cookie parser,
	 * the body parser for URL encoded content and JSON content.
	 */
	protected setupDefaultMiddleware(): void {
		this.server.use(cookieParser());
		this.server.use(express.urlencoded({ extended: true }));
		this.server.use(express.json());
	}
}
