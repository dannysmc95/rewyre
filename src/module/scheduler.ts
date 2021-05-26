import { ILogger } from '../interface/logger';
import { IOptions } from '../interface/options';

/**
 * The scheduler class is for managing the services defined by the user
 * it takes the service list (after injections) and then processes each
 * service and creates an interval timer to call the service.
 */
export class Scheduler {

	protected services: Array<any> = [];
	protected _timer: any;

	/**
	 * Creates an instance of the scheduler class.
	 * 
	 * @param options The framework options.
	 */
	public constructor(protected options: IOptions, protected logger: ILogger) {}

	/**
	 * Will setup the services locally to the class, then will call
	 * the next method to create the interval timers for each service.
	 * 
	 * @param services The array of services.
	 */
	public process(services: Array<any>): void {
		this.services = services;
		this.setupSchedules();
	}

	/**
	 * Will loop the services and setup interval timers for each service
	 * to make sure they are called at the X amount of seconds as defined
	 * when creating the service.
	 */
	protected setupSchedules(): void {
		this.services.forEach((service: any) => {
			service.timer = setInterval(() => {
				this.logger.verbose('SHEDULER', `Scheduled service: ${service.name} is being executed.`);
				service.instance.execute();
			}, parseInt(service.schedule) * 1000);
		});
	}
}
