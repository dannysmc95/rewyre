import { Request, Response, NextFunction, Application } from 'express';
import { IOptions } from '../interface/options';
import { FrameworkHelper } from '../helper/framework';
import { ErrorMessages } from '../enum/error-messages';
import { AbstractController } from '../abstract/controller';
import { AbstractModel } from '../abstract/model';
import { AbstractService } from '../abstract/service';
import { AbstractProvider } from '../abstract/provider';
import { AbstractGuard } from '../abstract/guard';
import { Router } from './router';
import { HTTPServer } from './http-server';
import { WSServer } from './ws-server';
import { Database } from './database';
import { Scheduler } from './scheduler';
import { HookManager } from './hook-manager';
import { State } from './state';
import { Authenticator } from './authenticator';
import { IDatabaseDriver } from '../interface/database-driver';
import { ILogger } from '../interface/logger';
import { WSHelper } from '../helper/ws-helper';
import { HookTypes, FrameworkModules } from '../type/general';
import { performance } from 'perf_hooks';
import { IPlugin } from '../interface/plugin';
import { PluginManager } from './plugin-manager';
import { Registry } from './registry';
import { extname } from 'path';

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
	protected guards: Array<any> = [];
	protected drivers: Array<any> = [];
	protected http_server: HTTPServer;
	protected ws_server: WSServer;
	protected ws_helper: WSHelper;
	protected database: Database;
	protected scheduler: Scheduler;
	protected authenticator: Authenticator;
	protected hooks: HookManager;
	protected state: State;
	protected plugin: PluginManager;
	protected registry: Registry;
	protected logger: ILogger;

	/**
	 * Creates a new instance of the rewyre framework, with the
	 * server options to configure the engine, this function does
	 * not start the server, only prepares it.
	 * 
	 * @param options The framework options.
	 * @returns Framework.
	 */
	public constructor(options?: IOptions) {

		// Create helper and merge options.
		this.helper = new FrameworkHelper();
		this.options = this.helper.mergeOptions(options);

		// Validate and assign logger.
		if (!this.options.logger) throw new Error('No valid logger given.');
		this.logger = this.options.logger;

		// Set build environment.
		const pathExtension = extname(__filename);
		process.env.BUILD_ENV = pathExtension === '.ts' ? 'dev' : 'prod';

		// Setup the hook manager.
		this.hooks = new HookManager(this.logger);

		// Now load the other modules.
		this.authenticator = new Authenticator(this.guards, this.logger);
		this.state = new State(this.options, this.logger);
		this.database = new Database(this.options, this.logger);
		this.router = new Router(this.options, this.authenticator, this.logger);
		this.http_server = new HTTPServer(this.options, this.router, this.logger, this.hooks);
		this.ws_server = new WSServer(this.options, this.http_server, this.router, this.logger, this.hooks);
		this.ws_helper = new WSHelper(this.options, this.ws_server, this.logger);
		this.scheduler = new Scheduler(this.options, this.logger, this.hooks);
		this.plugin = new PluginManager(this.options, this.logger, this);
		this.registry = new Registry(this.options, this.logger);
	}

	/**
	 * Registers classes with the framework, this can/will be
	 * controllers, models, services. Decorators automatically
	 * apply class types for the register function to pick up,
	 * as long as their is a rewyre specific decorator on the
	 * class, then the register command will manage it.
	 * 
	 * @param class_list An array of the modules.
	 * @returns void.
	 */
	public register(class_list: Array<FrameworkModules>): void {
		class_list.forEach((class_item: FrameworkModules) => {
			if (!Reflect.hasMetadata('class_type', class_item)) throw new Error(ErrorMessages.NO_CLASS_TYPE);
			const classType: string = Reflect.getMetadata('class_type', class_item);
			this.logger.verbose('FRAMEWORK', `Registering class type: ${classType}.`);
			this[`register${this.helper.capitalise(classType)}`](class_item);
		});
	}

	/**
	 * This method takes a plugin and then registers it to the framework, by registering
	 * all given modules, hooks, option overrides and configuration.
	 * 
	 * @param plugin The plugin.
	 */
	public use(plugin: IPlugin): void {
		this.plugin.use(plugin);
	}

	/**
	 * This method applies a middleware function directly to the
	 * underlying Express server, which affects both the HTTP and
	 * WebSocket connections.
	 * 
	 * @param middleware The middleware function.
	 * @returns void.
	 */
	public useMiddleware(middleware: (request: Request, response: Response, next: NextFunction) => void): void {
		this.logger.verbose('FRAMEWORK', 'Accepting middleware registration.');
		this.http_server.useProxy(middleware);
	}

	/**
	 * This method will create static routes and map them directly
	 * to the underlying Express server.
	 * 
	 * @param folder_path The path to the folder you wish to be accessible.
	 * @param url_path [Optional] The URL path to access the static folder.
	 * @returns void.
	 */
	public useStatic(folder_path: string, url_path?: string): void {
		this.logger.verbose('FRAMEWORK', 'Accepting static registration.');
		this.http_server.useStaticProxy(folder_path, url_path);
	}

	/**
	 * Get the underlying HTTP server so that the user can extend and call
	 * methods directly on the Express instance if needed.
	 * 
	 * @returns express.Application.
	 */
	public getHttpServer(): Application {
		return this.http_server.getInstance();
	}

	/**
	 * This method returns the registry instance that is currently being used
	 * by the framework and can be used to assign data.
	 * 
	 * @returns Registry.
	 */
	public getRegistry(): Registry {
		return this.registry;
	}

	/**
	 * Returns the currently used logger instance.
	 * 
	 * @returns ILogger.
	 */
	public getLogger(): ILogger {
		return this.logger;
	}

	/**
	 * This method will register a hook against the hook manager, which will be called
	 * in turns, hook should be registered as the first thing after creating an instance
	 * of the framework.
	 * 
	 * @param type The hook type to register against.
	 * @param func The function to call for this hook.
	 * @returns void.
	 */
	public registerHook(type: HookTypes, func: Function): void {
		this.hooks.register(type, func);
	}

	/**
	 * This will start the framework, including starting the HTTP
	 * and WebSocket (if applicable) server and prepare the registered
	 * classes, that being controllers, models, services, etc.
	 * 
	 * @returns Promise<void>.
	 */
	public async start(): Promise<void> {

		// Process the registered classes.
		const rwLaunchStart = performance.now();
		this.logger.verbose('FRAMEWORK', 'Starting application, launching setup (process).');
		this.hooks.dispatch('init', 'pre_init', this);
		await this.process();

		// Initialise the state.
		this.logger.verbose('FRAMEWORK', 'Starting application, launching state initialisation.');
		await this.state.initialise();
		this.hooks.dispatch('init', 'post_init', this);

		// Now start the servers.
		this.logger.verbose('FRAMEWORK', 'Starting application, launching HTTP/WS service.');
		this.hooks.dispatch('start', 'pre_start', this);
		this.http_server.start();
		this.hooks.dispatch('start', 'post_start', this);

		// Log launch message.
		this.logger.verbose('FRAMEWORK', `Application launched successfully in ${parseFloat(String(performance.now() - rwLaunchStart)).toFixed(2)}ms.`);
		this.logger.info('FRAMEWORK', `Application is listening at http://${this.options.host}:${this.options.port}/${this.options.websocket ? ` and ws://${this.options.host}:${this.options.port}${this.options.websocket_path}` : ''}.`);
		this.logger.info('FRAMEWORK', `Registered ${this.controllers.length} controller(s), ${this.models.length} model(s), ${this.services.length} service(s), ${this.guards.length} guard(s), and ${this.providers.length} provider(s).`);
	}

	/**
	 * This method will process the given controllers, models, services
	 * and prepare them for use with the application, from here we will
	 * create instances for the registered classes, then once we have done
	 * that we shall then inject the required classes, once injection has
	 * been completed, they are passed to the HTTP server and then the WS
	 * server to be processed to have executors applied to them, from there
	 * we shall start the HTTP and WS servers.
	 * 
	 * @returns Promise<void>.
	 */
	protected async process(): Promise<void> {

		// Initialise the database.
		this.logger.verbose('PROCESS', 'Starting database initialisation.');
		this.database.customDrivers(this.drivers);
		await this.database.initialise();

		// Initialise the model instances.
		this.logger.verbose('PROCESS', 'Starting model initialisation.');
		this.models.forEach((model: any) => {
			model.instance = new model.class(model.name, model.type, model.fields, this.database.getDatabase(model.unique));
			model.instance.state = this.state;
			model.instance.options = this.options;
		});

		// Initialise the provider instances and check injections.
		this.logger.verbose('PROCESS', 'Starting providers initialisation.');
		this.providers.forEach((provider: any) => {
			if (provider.type === 'shared') {
				provider.instance = new provider.class();
				provider.instance.state = this.state;
				provider.instance.options = this.options;
			} else {
				provider.instance = false;
			}
		});

		// Define the injectables.
		const injectables = {
			models: this.models,
			providers: this.providers,
			state: this.state,
			options: this.options,
			builtins: {
				websocket: this.ws_helper,
				logger: this.logger,
				framework: this,
				registry: this.registry,
			},
		};

		// Inject the injectables to suppoted classes.
		this.logger.verbose('PROCESS', 'Starting injection process.');
		this.helper.inject(this.providers, injectables);
		this.helper.inject(this.services, injectables);
		this.helper.inject(this.controllers, injectables);
		this.helper.inject(this.guards, injectables);

		// Process the services in the scheduler.
		this.logger.verbose('PROCESS', 'Starting scheduled initialisation.');
		this.scheduler.process(this.services);

		// Process the controllers for HTTP.
		this.logger.verbose('PROCESS', 'Starting HTTP server initialisation.');
		this.http_server.process(this.controllers);

		// Process the controllers for WS.
		this.logger.verbose('PROCESS', 'Starting WS server initialisation.');
		this.ws_server.process(this.controllers);
	}

	/**
	 * Takes the uninstatiated controller class and prepares it for
	 * the framework to instantiate it and use it to create the required
	 * routes, etc.
	 * 
	 * @param class_item The controller class.
	 * @returns void.
	 */
	protected registerController(class_item: AbstractController): void {
		const controllerPrefix: string = Reflect.getMetadata('prefix', class_item);
		const controllerNamespace: string = Reflect.getMetadata('namespace', class_item);
		const controllerRoutes: any = Reflect.getMetadata('routes', class_item);
		const controllerWSEnable: boolean = Reflect.getMetadata('websocket', class_item);
		const controllerInjects: Array<any> = Reflect.getMetadata('injects', class_item);
		const controllerThreaded: boolean = Reflect.getMetadata('threaded', class_item) || false;

		const classModuleObject = {
			prefix: controllerPrefix,
			namespace: controllerNamespace,
			routes: controllerRoutes,
			websocket: controllerWSEnable,
			injects: controllerInjects,
			threaded: controllerThreaded,
			class_type: 'controller',
			class: class_item,
		};

		this.hooks.dispatch('register', classModuleObject);
		this.controllers.push(classModuleObject);
	}

	/**
	 * Takes the uninstatiated model class and prepares it for
	 * the framework to instantiate it and use it to create the required
	 * model definitions, etc.
	 * 
	 * @param class_item The model class.
	 * @return void.
	 */
	protected registerModel(class_item: AbstractModel): void {
		const modelName: string = Reflect.getMetadata('name', class_item);
		const modelFields: any = Reflect.getMetadata('fields', class_item);
		const modelUnique: string = Reflect.getMetadata('database', class_item);
		const modelType: 'general' | 'user' = Reflect.getMetadata('type', class_item);

		const classModuleObject = {
			name: modelName,
			fields: modelFields,
			type: modelType,
			unique: modelUnique,
			class_type: 'model',
			class: class_item,
		};

		this.hooks.dispatch('register', classModuleObject);
		this.models.push(classModuleObject);
	}

	/**
	 * Takes the uninstatiated service class and prepares it for
	 * the framework to instantiate it and register it to the service
	 * manager so that it get's called when required.
	 * 
	 * @param class_item The controller class.
	 * @returns void.
	 */
	protected registerService(class_item: AbstractService): void {
		const serviceName: string = Reflect.getMetadata('name', class_item);
		const serviceSchedule: number = Reflect.getMetadata('schedule', class_item);
		const serviceSyntax: string = Reflect.getMetadata('syntax', class_item);
		const serviceInjects: Array<any> = Reflect.getMetadata('injects', class_item);

		const classModuleObject = {
			name: serviceName,
			schedule: serviceSchedule,
			syntax: serviceSyntax,
			injects: serviceInjects,
			class_type: 'service',
			class: class_item,
		};

		this.hooks.dispatch('register', classModuleObject);
		this.services.push(classModuleObject);
	}

	/**
	 * Takes the uninstatiated provider class and prepares it for
	 * the framework to instantiate it and register it and inject
	 * it to the requiring controllers.
	 * 
	 * @param class_item The provider class.
	 * @returns void.
	 */
	protected registerProvider(class_item: AbstractProvider): void {
		const providerName: string = Reflect.getMetadata('name', class_item);
		const providerType: 'single' | 'shared' = Reflect.getMetadata('type', class_item);
		const providerInjects: Array<any> = Reflect.getMetadata('injects', class_item);

		const classModuleObject = {
			name: providerName,
			type: providerType,
			injects: providerInjects,
			class_type: 'provider',
			class: class_item,
		};

		this.hooks.dispatch('register', classModuleObject);
		this.providers.push(classModuleObject);
	}

	/**
	 * Takes the uninstatiated guard class and prepares it for
	 * the framework to instantiate it and register it and prepare
	 * it for use with the framework.
	 * 
	 * @param class_item The guard class.
	 * @returns void.
	 */
	protected registerGuard(class_item: AbstractGuard): void {
		const guardName: string = Reflect.getMetadata('name', class_item);
		const guardIsFallBack: boolean = Reflect.getMetadata('is_fallback', class_item);
		const guardInjects: Array<any> = Reflect.getMetadata('injects', class_item);

		const classModuleObject = {
			name: guardName,
			is_fallback: guardIsFallBack,
			injects: guardInjects,
			class_type: 'guard',
			class: class_item,
		};

		this.hooks.dispatch('register', classModuleObject);
		this.guards.push(classModuleObject);
	}

	/**
	 * Takes the driver definition and prepares it ready to be
	 * initialised into the framework. This will then be called on
	 * when the driver is called on.
	 * 
	 * @param class_item The driver class.
	 * @returns void.
	 */
	protected registerDriver(class_item: IDatabaseDriver): void {
		const driverName: string = Reflect.getMetadata('name', class_item);

		const classModuleObject = {
			name: driverName,
			class: class_item,
			class_type: 'driver',
		};

		this.hooks.dispatch('register', classModuleObject);
		this.drivers.push(classModuleObject);
	}
}
