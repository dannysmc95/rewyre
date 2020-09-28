import { IOptions } from "../interface/options";

export class Scheduler {

	protected services: Array<any> = [];
	protected _timer: any;

	constructor(protected options: IOptions) {}

	public process(services: Array<any>): void {
		this.services = services;
		this.setupSchedules();
	}

	protected setupSchedules(): void {
		this.services.forEach((service: any) => {
			service.timer = setInterval(() => {
				service.instance.execute();
			}, parseInt(service.schedule) * 1000);
		});
	}
}