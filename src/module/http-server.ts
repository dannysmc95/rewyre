import { IOptions } from '../interface/options';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

/**
 * The HTTPServer is the wrapper around the express server,
 * this manages all controllers in the context of the HTTP
 * server, and manages basic control of the HTTP server.
 */
export class HTTPServer {

	protected server: express.Application;
	protected controllers!: Array<any>;
	protected models!: Array<any>;

	/**
	 * Creates an instance of the HTTPServer, with the framework options,
	 * from here this will be able to manipulate and manage the HTTP server.
	 * 
	 * @param options The framework options.
	 */
	constructor(protected options: IOptions) {
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
	public process(controllers: Array<any>, models: Array<any>): void {
		this.controllers = controllers;
		this.models = models;
		this.buildRoutes();
	}

	/**
	 * Loops through the routes, and builds the desired route, specifically
	 * for the 
	 */
	protected buildRoutes(): void {
		this.controllers.forEach((controller: any) => {
			controller.routes.forEach((route: any) => {

				console.log(route);

				// Create the express route.
				this.server[route.requestMethod](controller.prefix + route.path, (request: express.Request, response: express.Response) => {

					console.log(route);
					response.status(200).json({message: 'Hello'});

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
		this.server.use(bodyParser.urlencoded({ extended: true }));
		this.server.use(bodyParser.json());
	}
}