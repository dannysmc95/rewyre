import * as packageJson from '../../package.json';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { MongoClient, MongoError } from 'mongodb';

import { IOptions } from '../interface/options';
import { IReturn } from '../interface/return';
import { IRoute } from '../interface/route';
import { IContext } from '../interface/context';
import { AbstractController } from '../abstract/controller';
import { WSServer } from './ws-server';

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
	protected controllerRefs: Array<AbstractController> = [];

	constructor(options: IOptions) {
		this.server = express();
		this.server.use(cookieParser());
		this.server.use(bodyParser.urlencoded({ extended: true }));
		this.server.use(bodyParser.json());
		this.options = this.mergeOptions(options);
	}

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

	public async start(): Promise<void> {

		// We need to process the models.
		await this.processModels();

		// Initialise WebSocket server.
		this.wsserver = new WSServer(this.options, this.server, this.userModel);

		// Then we need to process controllers.
		await this.processControllers();

		// Then we need to prepare the websocket.
		await this.wsserver.prepare(this.controllerRefs);

		// Once the server is listening.
		this.server.listen(this.options.port, () => {
			console.log(`Rewyre Framework v${packageJson.version}, listening at http://${this.options.hostname}:${this.options.port}/.`);
			if (this.options.websocket) console.log(`WebSocket server active, listening at ws://${this.options.hostname}:${this.options.port}${this.options.websocket_path}.`);
			console.log(`There are ${this.controllers.length} controller(s), ${this.models.length} model(s) registered.`);
		});
	}

	private mergeOptions(options: IOptions): IOptions {
		const opts: IOptions = Object.assign({

			// Framework Generic.
			port: 3000,

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

	private async processControllers(): Promise<void> {
		this.controllers.forEach((controller: any) => {

			// Get the controller information and meta.
			const instance: AbstractController = new controller();
			const prefix: string = Reflect.getMetadata('prefix', controller);
			const routes: Array<IRoute> = Reflect.getMetadata('routes', controller);
			const models: Array<any> = Reflect.getMetadata('models', controller);

			// Assign HTTP and WS server to it.
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

			// Add the setup controller to a reference list.
			this.controllerRefs.push(instance);

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
							httpVersion: request.httpVersion,
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

	public registerStatic(root: string, path: string): void {
		this.server.use(root, express.static(path));
	}

	public registerControllers(controllers: Array<any>): void {
		for (const index in controllers) {
			this.controllers.push(controllers[index]);
		}
	}

	public registerModels(models: Array<any>): void {
		for (const index in models) {
			this.models.push(models[index]);
		}
	}

	public registerMiddleware(middleware: (request: express.Request, response: express.Response, next: express.NextFunction) => void): void {
		this.server.use(middleware);
	}

	public getExpressServer(): any {
		return this.server;
	}
}