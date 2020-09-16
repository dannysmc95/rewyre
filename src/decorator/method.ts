export function Method(method: string, path: string, allow_websocket = false): any {
	return (target: any, propertyKey: string): void => {

		// Read the route meta data.
		if (!Reflect.hasMetadata('methods', target.constructor)) {
			Reflect.defineMetadata('methods', [], target.constructor);
		}

		// Define the existing methods.
		const methods: Array<any> = Reflect.getMetadata('methods', target.constructor);

		// Create a new route for this method.
		methods.push({
			requestMethod: method.toLowerCase(),
			path: path,
			methodName: propertyKey,
			allow_websocket: allow_websocket,
		});

		// Re-assign the route meta.
		Reflect.defineMetadata('methods', methods, target.constructor);
	}
}