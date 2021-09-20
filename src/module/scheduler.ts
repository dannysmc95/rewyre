import { ILogger } from '../interface/logger';
import { IOptions } from '../interface/options';
import { HookManager } from './hook-manager';
import { CronJob } from 'cron';

/**
 * The scheduler class is for managing the services defined by the user
 * it takes the service list (after injections) and then processes each
 * service and creates an interval timer to call the service.
 */
export class Scheduler {

	protected services: Array<any> = [];
	protected _timer: any;
	protected scheduledServices: Array<{ job: CronJob, service: any }> = [];

	/**
	 * Creates an instance of the scheduler class.
	 * 
	 * @param options The framework options.
	 * @param logger The logger instance.
	 * @returns Scheduler.
	 */
	public constructor(protected options: IOptions, protected logger: ILogger, protected hooks: HookManager) {}

	/**
	 * Will setup the services locally to the class, then will call
	 * the next method to create the interval timers for each service.
	 * 
	 * @param services The array of services.
	 * @returns void.
	 */
	public process(services: Array<any>): void {
		this.services = services;
		this.setupSchedules();
	}

	/**
	 * Will loop the services and if using the millisecond (default syntax)
	 * then it will setup interval timers for each service to make sure they
	 * are called at the X amount of seconds as defined or if using the cron
	 * syntax then it will schedule node cron jobs when creating the service.
	 * 
	 * @returns void.
	 */
	protected setupSchedules(): void {
		this.services.forEach((service: any) => {
			if (service.syntax === 'ms') {
				service.timer = setInterval(() => {
					this.logger.verbose('SCHEDULER', `Scheduled service: ${service.name} is being executed.`);
					this.hooks.dispatch('service', service);
					service.instance.execute();
				}, parseInt(service.schedule) * 1000);
			} else if (service.syntax === 'cron') {
				const jobItem = {
					service: service,
					job: new CronJob(service.schedule, () => {
						this.logger.verbose('SCHEDULER', `Scheduled service: ${service.name} is being executed.`);
						this.hooks.dispatch('service', service);
						service.instance.execute();
					}, null, true, 'Europe/London'),
				};
				jobItem.job.start();
				this.scheduledServices.push(jobItem);
			} else {
				throw new Error('Unknown service schedule syntax.');
			}
		});
	}
}
