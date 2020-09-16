export function Controller(prefix: string, allowWebsocket = false): any {
	return (target: any) => {

		// Define the prefix for the controller.
		Reflect.defineMetadata('prefix', prefix, target);

		// Define the default for all methods, can be overwritten per method.
		Reflect.defineMetadata('allow_websocket', allowWebsocket, target);

		// Check if routes object exists, if not, create an empty array.
		if (!Reflect.hasMetadata('routes', target)) {
			Reflect.defineMetadata('routes', [], target);
		}
	}
}