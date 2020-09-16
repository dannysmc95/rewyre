export function Controller(prefix: string, namespace?: string): any {
	return (target: any) => {

		// Define the prefix for the controller.
		Reflect.defineMetadata('prefix', prefix, target);

		// Define the websocket namespace.
		if (namespace) {
			Reflect.defineMetadata('namespace', namespace, target);
			Reflect.defineMetadata('allow_websocket', true, target);
		} else {
			Reflect.defineMetadata('allow_websocket', false, target);
		}

		// Check if routes object exists, if not, create an empty array.
		if (!Reflect.hasMetadata('routes', target)) {
			Reflect.defineMetadata('routes', [], target);
		}
	}
}