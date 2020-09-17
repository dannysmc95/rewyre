import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { MongoClient, MongoError } from 'mongodb';
import { resolve } from 'path';
import { readFileSync } from 'fs';

import { IOptions } from '../interface/options';
import { IReturn } from '../interface/return';
import { IRoute } from '../interface/route';
import { IContext } from '../interface/context';
import { AbstractController } from '../abstract/controller';
import { WSServer } from './ws-server';

/**
 * The server is the main HTTP server class and is used to manage the
 * whole HTTP server part of the framework, and contains various functionality
 * to support this.
 */
export class Server {

	protected options: IOptions;
	protected server: any;
	protected controllers: Array<any> = [];
	protected models: Array<any> = [];
	protected availableModels: any = {};
	protected client: any;
	protected database: any;
	protected userModel: any = false;
	protected wsserver?: WSServer;
	protected wsControllers: any = {};
	protected package: any = {};

	constructor(options: IOptions) {
		this.server = express();
		this.server.use(cookieParser());
		this.server.use(bodyParser.urlencoded({ extended: true }));
		this.server.use(bodyParser.json());
		this.options = this.mergeOptions(options);
		this.readPackageJson();
	}

	/**
	 * Reads the package JSON object so we can use
	 * specific properties from the package.
	 */
	private readPackageJson(): void {
		const package_path: string = resolve(__dirname, '../../package.json');
		this.package = JSON.parse(readFileSync(package_path, 'utf-8'));
	}

	/**
	 * Used to init any required code, this at the
	 * moment initalises the database if enabled.
	 */
	public async init(): Promise<any> {

		// Prepare and initialise database.
		if (this.options.database) {
			if (this.options.username && this.options.password) {
				await this.setupDatabase(true);
			} else {
				await this.setupDatabase(false);
			}
		}
	}

	/**
	 * Used to setup the database connection and return a
	 * client context back to the server instance.
	 * 
	 * @param shouldAuth Whether to auth to the database.
	 */
	public async setupDatabase(shouldAuth = false): Promise<void> {
		return new Promise((resolve: any, reject: any) => {
			const context = this;
			let database_uri: string;
			if (shouldAuth) {
				database_uri = `mongodb://${this.options.username}:${this.options.password}@${this.options.hostname}:${this.options.db_port}/${this.options.database}`;
			} else {
				database_uri = `mongodb://${this.options.hostname}:${this.options.db_port}/${this.options.database}`;
			}

			MongoClient.connect(database_uri, {
				useUnifiedTopology: true,
				useNewUrlParser: true,
			}, (err: MongoError, client: MongoClient) => {
				if (err) reject(`Failed to connect to database, code: ${err.code} and message: ${err.message}.`);
				context.client = client;
				resolve(true);
			});
		});
	}

	/**
	 * Procedurally goes through the start processing
	 * initialising the controllers, models, the WebSocket
	 * server and sets the servers to listen.
	 */
	public async start(): Promise<void> {

		// We need to process the models.
		await this.processModels();

		// Setup the websocket namespace and methods.
		this.wsserver = new WSServer(this.options, this.server);
		if (this.options.websocket) {
			await this.processWebsocketRoutes();
			this.wsserver.prepare(this.wsControllers);
		}

		// Then we need to process controllers.
		await this.processControllers();

		// Once the server is listening.
		this.server.listen(this.options.port, () => {
			console.log(`Rewyre Framework v${this.package.version}, listening at http://${this.options.hostname}:${this.options.port}/.`);
			if (this.options.websocket) console.log(`WebSocket server active, listening at ws://${this.options.hostname}:${this.options.port}${this.options.websocket_path}.`);
			console.log(`There are ${this.controllers.length} controller(s), ${this.models.length} model(s) registered.`);
		});
	}

	/**
	 * Used to merge the default options with the user given options.
	 * 
	 * @param options The options passed to the server.
	 */
	private mergeOptions(options: IOptions): IOptions {
		const opts: IOptions = Object.assign({

			// Framework Generic.
			port: 3000,
			debug: false,

			// Database Specific.
			db_port: 27017,
			hostname: 'localhost',

			// WebSocket Specific.
			websocket: false,
			websocket_path: '/ws',
			websocket_access: 'full', // Full = Everything is available, Partial = Use controller method to define access for WS.
		}, options);
		return opts;
	}

	/**
	 * Processes the models and creates instances of them ready
	 * to be injected into controllers.
	 */
	private async processModels(): Promise<void> {
		for (const index in this.models) {
			const definition: any = Reflect.getMetadata('model', this.models[index]);
			this.database = this.client.db(this.options.database);
			this.availableModels[definition.collection] = new this.models[index](definition, this.database.collection(definition.collection));
			if (definition.isUserModel === true) {
				if (this.userModel !== false) throw new Error('You can only have one core user model, if you want another user model, then define it without setting the isUserModel option as this is for core user models only.');
				this.userModel = {
					instance: this.availableModels[definition.collection],
					collection: definition.collection,
				};
			}
		}
	}

	/**
	 * Processes a series of routes specifically for WebSockets
	 * and prepares them ready to be called upon from the WebSocket
	 * server.
	 */
	private async processWebsocketRoutes(): Promise<void> {
		this.controllers.forEach((controller: any) => {

			// Get the controller information and meta.
			const instance: AbstractController = new controller();
			const namespace: any = Reflect.getMetadata('namespace', controller);
			const allowWS: boolean = Reflect.getMetadata('allow_websocket', controller) || false;
			const routes: Array<IRoute> = Reflect.getMetadata('routes', controller);
			const models: Array<any> = Reflect.getMetadata('models', controller);

			// Check for WebSocket access.
			if (!allowWS) return;

			// Now instantiate all required models.
			for (const index in models) {
				if (typeof this.availableModels[models[index]] !== 'undefined') {
					instance.models[models[index]] = this.availableModels[models[index]];
				}
			}

			// Now we need to verify that any core models are included by default (i.e. users).
			if (this.userModel !== false) {
				if (typeof instance.models[this.userModel.collection] === 'undefined') {
					instance.models[this.userModel.collection] = this.userModel.instance;
					instance.coreUserModel = this.userModel.collection;
				}
			}

			// Define which methods are allowed.
			const methods: Array<string> = [];
			for (const index in routes) {
				if (routes[index].allow_websocket) {
					methods.push(routes[index].methodName);
				}
			}

			// Create a WebSocket controller instance.
			this.wsControllers[namespace] = {
				instance: instance,
				namespace: namespace,
				methods: methods,
			}
		});
	}

	/**
	 * Processes all the controllers and prepares them ready
	 * to be called from the HTTP server, this builds up the controller
	 * instances and the required models, including injecting the WebSocket
	 * server instance and generating all the given routes.
	 */
	private async processControllers(): Promise<void> {
		this.controllers.forEach((controller: any) => {

			// Get the controller information and meta.
			const instance: AbstractController = new controller();
			const prefix: string = Reflect.getMetadata('prefix', controller);
			const routes: Array<IRoute> = Reflect.getMetadata('routes', controller);
			const models: Array<any> = Reflect.getMetadata('models', controller);

			// Apply the websocket server.
			instance.setup(this.wsserver);

			// Now instantiate all required models.
			for (const index in models) {
				if (typeof this.availableModels[models[index]] !== 'undefined') {
					instance.models[models[index]] = this.availableModels[models[index]];
				}
			}

			// Now we need to verify that any core models are included by default (i.e. users).
			if (this.userModel !== false) {
				if (typeof instance.models[this.userModel.collection] === 'undefined') {
					instance.models[this.userModel.collection] = this.userModel.instance;
					instance.coreUserModel = this.userModel.collection;
				}
			}

			// Loop the routes and setup the events.
			routes.forEach((route: any) => {
				this.server[route.requestMethod](prefix + route.path, async (request: express.Request, response: express.Response): Promise<void> => {

					// Wrap in a try; catch
					try {

						// Define headers
						const headers: any = {};
						for (const index in request.headers) {
							headers[index] = request.headers[index];
						}

						// Define query
						const query: any = {};
						for (const index in request.query) {
							query[index] = request.query[index];
						}

						// Define params
						const params: any = {};
						for (const index in request.params) {
							params[index] = request.params[index];
						}

						// Define cookies
						const cookies: any = {};
						let auth_token = '';
						for (const index in request.cookies) {
							if (index === 'Rewyre-Auth') auth_token = request.cookies[index];
							cookies[index] = request.cookies[index];
						}

						// Create the context object.
						const context: IContext = {
							headers: headers,
							requestedUrl: request.url,
							httpMethod: request.method,
							ipAddress: request.socket.remoteAddress || '',
							params: params,
							query: query,
							cookies: cookies,
							body: request.body,
							auth_token: auth_token,
							isWebSocket: false,
							socket: request.socket,
							session: {
								logged_in: false,
								role: false,
							},
							raw: {
								request: request,
								response: response,
							},
							setCookie: (name: string, value: string, maxAge?: number, httpOnly?: boolean, secure?: boolean) => {
								const cookieParams: any = {};
								if (maxAge) cookieParams.maxAge = (1000 * 86400 * maxAge);
								if (httpOnly) cookieParams.httpOnly = httpOnly;
								if (secure) cookieParams.secure = secure;
								response.cookie(name, value, cookieParams);
								return true;
							}
						}

						// Call the function in the callback with the context.
						const result: IReturn = await instance[route.methodName](context);
						response.status(result.status).send(result.content);

					} catch(err) {

						// Notify console of the error.
						response.status(500).send();
						console.error(err);
					}
				});
			});
		});
	}

	/**
	 * Used to register a static route through to express.
	 * 
	 * @param root The URL path.
	 * @param path The path to the folder.
	 */
	public registerStatic(root: string, path: string): void {
		this.server.use(root, express.static(path));
	}

	/**
	 * Registers all user controllers to be instantiated and prepared.
	 * 
	 * @param controllers Array of controller classes (not instatiated).
	 */
	public registerControllers(controllers: Array<any>): void {
		for (const index in controllers) {
			this.controllers.push(controllers[index]);
		}
	}

	/**
	 * Registers all user models to be instantaited and prepared.
	 */
	public registerModels(models: Array<any>): void {
		for (const index in models) {
			this.models.push(models[index]);
		}
	}

	/**
	 * This function is a proxy to express.use, and should be a function specifically
	 * for express middleware.
	 * 
	 * @param middleware The middleware function.
	 */
	public registerMiddleware(middleware: (request: express.Request, response: express.Response, next: express.NextFunction) => void): void {
		this.server.use(middleware);
	}

	/**
	 * Will return the underlying express server.
	 */
	public getExpressServer(): any {
		return this.server;
	}
}