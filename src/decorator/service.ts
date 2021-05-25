/**
 * The service decorator controls the service definitions, each service is created
 * as a definition with a schedule, and each service can be executed inside a thread
 * if the threaded decorator is provided. The schedule is a second based length,
 * so it will run every X amount of seconds.
 * 
 * @param name The name of the service.
 * @param schedule The schedule for the service.
 * @returns Function
 */
export function Service(name: string, schedule: number): any {
	return (target: any) => {

		// Define base class information.
		Reflect.defineMetadata('class_type', 'service', target);
		Reflect.defineMetadata('name', name, target);
		Reflect.defineMetadata('schedule', schedule, target);
		if (!Reflect.hasMetadata('injects', target)) Reflect.defineMetadata('injects', [], target);
	};
}