/**
 * The service decorator controls the service definitions, each service is created
 * as a definition with a schedule, and each service can be executed inside a thread
 * if the threaded decorator is provided.
 */
export function Service(name: string): any {
	return (target: any) => {

		// Define the name for the service.
		Reflect.defineMetadata('name', name, target);
	}
}