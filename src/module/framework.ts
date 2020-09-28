import { IOptions } from '../interface/options';
import { Request, Response, NextFunction } from 'express';
import { FrameworkHelper } from '../helper/framework';
import { ErrorMessages } from '../enum/error-messages';
import { AbstractController } from '../abstract/controller';
import { AbstractModel } from '../abstract/model';
import { AbstractService } from '../abstract/service';
import { AbstractProvider } from '../abstract/provider';
import { Router } from './router';
import { HTTPServer } from './http-server';
import { WSServer } from './ws-server';
import { Database } from './database';
import { Collection } from 'mongodb';
import { Logger } from './logger';
import { Scheduler } from './scheduler';

/**
 * The framework is the core part of the rewyre package, the
 * framework manages routing, the HTTP and WebSocket servers,
 * as well as managing routing and threading, using the built
 * modules, the framework is where it all happens.
 */
export class Framework {

	protected options: IOptions;
	protected helper: FrameworkHelper;
	protected router: Router;
	protected controllers: Array<any> = [];
	protected models: Array<any> = [];
	protected services: Array<any> = [];
	protected providers: Array<any> = [];
	protected http_server: HTTPServer;
	protected ws_server: WSServer;
	protected database: Database;
	protected logger: Logger;
	protected scheduler: Scheduler;

	/**
	 * Creates a new instance of the rewyre framework, with the
	 * server options to configure the engine, this function does
	 * not start the server, only prepares it.
	 * 
	 * @param options The framework options.
	 */
	constructor(options?: IOptions) {
		this.logger = new Logger();
		this.helper = new FrameworkHelper();
		this.options = this.helper.mergeOptions(options);
		this.database = new Database(this.options);
		this.router = new Router(this.options);
		this.http_server = new HTTPServer(this.options, this.router);
		this.ws_server = new WSServer(this.options, this.http_server, this.router);
		this.scheduler = new Scheduler(this.options);
	}

	/**
	 * Registers classes with the framework, this can/will be
	 * controllers, models, services. Decorators automatically
	 * apply class types for the register function to pick up,
	 * as long as their is a rewyre specific decorator on the
	 * class, then the register command will manage it.
	 */
	public register(class_list: Array<AbstractController | AbstractModel | AbstractService>): void {
		class_list.forEach((class_item: AbstractController | AbstractModel | AbstractService) => {
			if (!Reflect.hasMetadata('class_type', class_item)) throw new Error(ErrorMessages.NO_CLASS_TYPE);
			const classType: string = Reflect.getMetadata('class_type', class_item);
			this[`register${this.helper.capitalise(classType)}`](class_item);
		});
	}

	/**
	 * This method applies a middleware function directly to the
	 * underlying Express server, which affects both the HTTP and
	 * WebSocket connections.
	 * 
	 * @param middleware The middleware function.
	 */
	public useMiddleware(middleware: (request: Request, response: Response, next: NextFunction) => void): void {
		console.log('framework.useMiddleware', middleware);
	}

	/**
	 * This method will create static routes and map them directly
	 * to the underlying Express server.
	 * 
	 * @param url_path The URL path to access the static folder.
	 * @param folder_path The path to the folder you wish to be accessible.
	 */
	public useStatic(url_path: string, folder_path: string): void {
		console.log('framework.useStatic', url_path, folder_path);
	}

	/**
	 * This will start the framework, including starting the HTTP
	 * and WebSocket (if applicable) server and prepare the registered
	 * classes, that being controllers, models, services, etc.
	 */
	public async start(): Promise<void> {

		// Process the registered classes.
		await this.process();

		// Now start the servers.
		this.http_server.start();

		// Log launch message.
		this.logger.notice('FRAMEWORK', `Application is listening and available at http://${this.options.hostname}:${this.options.port}/${this.options.ws_enable ? ` and ws://${this.options.hostname}:${this.options.port}${this.options.ws_path}` : ''}.`);
		this.logger.notice('FRAMEWORK', `Registered ${this.controllers.length} controller(s), ${this.models.length} model(s), ${this.services.length} service(s), and ${this.providers.length} provider(s).`);
	}

	/**
	 * This method will process the given controllers, models, services
	 * and prepare them for use with the application, from here we will
	 * create instances for the registered classes, then once we have done
	 * that we shall then inject the required classes, once injection has
	 * been completed, they are passed to the HTTP server and then the WS
	 * server to be processed to have executors applied to them, from there
	 * we shall start the HTTP and WS servers.
	 */
	protected async process(): Promise<void> {

		// Initialise the database.
		await this.database.initialise();

		// Initialise the model instances.
		this.models.forEach((model: any) => {
			const collection: Collection = this.database.getCollection(model.name);
			model.instance = new model.class(model.name, model.type, model.fields, collection);
		});

		// Initialise the provider instances and check injections.
		this.providers.forEach((provider: any) => {
			if (provider.type === 'shared') {
				provider.instance = new provider.class();
			} else {
				provider.instance = false;
			}
		});

		// Initialise the services.
		this.services.forEach((service: any) => {

			// Create service instance.
			service.instance = new service.class();

			// Proceed only if there are injections available.
			if (service.injects.length === 0) return;

			// Let's look for any matching classes.
			service.injects.forEach((inject_name: string) => {

				// Search for a model.
				const model: any = this.helper.findMatching(this.models, inject_name);
				if (model !== false) service.instance[inject_name] = model.instance;

				// Search for a provider.
				const provider: any = this.helper.findMatching(this.providers, inject_name);
				if (provider !== false) {
					if (provider.type === 'shared') {
						service.instance[inject_name] = provider.instance;
					} else if (provider.type === 'single') {
						service.instance[inject_name] = new provider.class();
					}
				}
			});
		});

		// Initialise the controller instances and check injections.
		this.controllers.forEach((controller: any) => {

			// Create controller instance.
			controller.instance = new controller.class();

			// Proceed only if there are injections available.
			if (controller.injects.length === 0) return;

			// Let's look for any matching classes.
			controller.injects.forEach((inject_name: string) => {

				// Search for a model.
				const model: any = this.helper.findMatching(this.models, inject_name);
				if (model !== false) controller.instance[inject_name] = model.instance;

				// Search for a provider.
				const provider: any = this.helper.findMatching(this.providers, inject_name);
				if (provider !== false) {
					if (provider.type === 'shared') {
						controller.instance[inject_name] = provider.instance;
					} else if (provider.type === 'single') {
						controller.instance[inject_name] = new provider.class();
					}
				}
			});
		});

		// Process the services in the scheduler.
		this.scheduler.process(this.services);

		// Process the controllers for HTTP.
		this.http_server.process(this.controllers);

		// Process the controllers for WS.
		this.ws_server.process(this.controllers);
	}

	/**
	 * Takes the uninstatiated controller class and prepares it for
	 * the framework to instantiate it and use it to create the required
	 * routes, etc.
	 * 
	 * @param class_item The controller class.
	 */
	protected registerController(class_item: AbstractController): void {
		const controllerPrefix: string = Reflect.getMetadata('prefix', class_item);
		const controllerNamespace: string = Reflect.getMetadata('namespace', class_item);
		const controllerRoutes: any = Reflect.getMetadata('routes', class_item);
		const controllerWSEnable: boolean = Reflect.getMetadata('websocket', class_item);
		const controllerInjects: Array<any> = Reflect.getMetadata('injects', class_item);
		const controllerThreaded: boolean = Reflect.getMetadata('threaded', class_item) || false;

		this.controllers.push({
			prefix: controllerPrefix,
			namespace: controllerNamespace,
			routes: controllerRoutes,
			websocket: controllerWSEnable,
			injects: controllerInjects,
			threaded: controllerThreaded,
			class: class_item,
		});
	}

	/**
	 * Takes the uninstatiated model class and prepares it for
	 * the framework to instantiate it and use it to create the required
	 * model definitions, etc.
	 * 
	 * @param class_item The model class.
	 */
	protected registerModel(class_item: AbstractModel): void {
		const modelName: string = Reflect.getMetadata('name', class_item);
		const modelFields: any = Reflect.getMetadata('fields', class_item);
		const modelType: 'general' | 'user' = Reflect.getMetadata('type', class_item);

		this.models.push({
			name: modelName,
			fields: modelFields,
			type: modelType,
			class: class_item,
		});
	}

	/**
	 * Takes the uninstatiated service class and prepares it for
	 * the framework to instantiate it and register it to the service
	 * manager so that it get's called when required.
	 * 
	 * @param class_item The controller class.
	 */
	protected registerService(class_item: AbstractService): void {
		const serviceName: string = Reflect.getMetadata('name', class_item);
		const serviceSchedule: number = Reflect.getMetadata('schedule', class_item);
		const serviceInjects: Array<any> = Reflect.getMetadata('injects', class_item);

		this.services.push({
			name: serviceName,
			schedule: serviceSchedule,
			injects: serviceInjects,
			class: class_item,
		});
	}

	/**
	 * Takes the uninstatiated provider class and prepares it for
	 * the framework to instantiate it and register it and inject
	 * it to the requiring controllers.
	 * 
	 * @param class_item The provider class.
	 */
	protected registerProvider(class_item: AbstractProvider): void {
		const providerName: string = Reflect.getMetadata('name', class_item);
		const providerType: 'single' | 'shared' = Reflect.getMetadata('type', class_item);

		this.providers.push({
			name: providerName,
			type: providerType,
			class: class_item,
		});
	}
}