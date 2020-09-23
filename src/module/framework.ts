import { IOptions } from '../interface/options';
import { Request, Response, NextFunction } from 'express';
import { FrameworkHelper } from '../helper/framework';
import { ErrorMessages } from '../enum/error-messages';
import { AbstractController } from '../abstract/controller';
import { AbstractModel } from '../abstract/model';
import { AbstractService } from '../abstract/service';
import { Router } from './router';
import { HTTPServer } from './http-server';
import { WSServer } from './ws-server';

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
	protected controllers: Array<AbstractController> = [];
	protected models: Array<AbstractModel> = [];
	protected services: Array<AbstractService> = [];
	protected http_server: HTTPServer;
	protected ws_server: WSServer;

	/**
	 * Creates a new instance of the rewyre framework, with the
	 * server options to configure the engine, this function does
	 * not start the server, only prepares it.
	 * 
	 * @param options The framework options.
	 */
	constructor(options?: IOptions) {
		this.helper = new FrameworkHelper();
		this.options = this.helper.mergeOptions(options);
		this.router = new Router();
		this.http_server = new HTTPServer();
		this.ws_server = new WSServer();
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
	public useMiddleware(middleware: (request: Request, response: Response, next: NextFunction) => void): void {}

	/**
	 * This method will create static routes and map them directly
	 * to the underlying Express server.
	 * 
	 * @param url_path The URL path to access the static folder.
	 * @param folder_path The path to the folder you wish to be accessible.
	 */
	public useStatic(url_path: string, folder_path: string): void {}

	/**
	 * This will start the framework, including starting the HTTP
	 * and WebSocket (if applicable) server and prepare the registered
	 * classes, that being controllers, models, services, etc.
	 */
	public async start(): Promise<void> {}

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
		const controllerMethods: Array<string> = Reflect.getMetadata('methods', class_item);
		const controllerWSEnable: boolean = Reflect.getMetadata('websocket', class_item);

		this.controllers.push({
			prefix: controllerPrefix,
			namespace: controllerNamespace,
			methods: controllerMethods,
			websocket: controllerWSEnable,
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
		const modelType: string = Reflect.getMetadata('type', class_item);

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
		const serviceSchedule: string = Reflect.getMetadata('schedule', class_item);

		this.services.push({
			name: serviceName,
			schedule: serviceSchedule,
			class: class_item,
		});
	}
}