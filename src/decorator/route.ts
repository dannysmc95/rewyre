export function Route(method: string, path: string, allow_websocket = false): any {
	return (target: any, propertyKey: string): void => {

		// Read the route meta data.
		if (!Reflect.hasMetadata('routes', target.constructor)) {
			Reflect.defineMetadata('routes', [], target.constructor);
		}

		// Define the existing routes.
		const routes: Array<any> = Reflect.getMetadata('routes', target.constructor);

		// Create a new route for this method.
		routes.push({
			requestMethod: method.toLowerCase(),
			path: path,
			methodName: propertyKey,
			allow_websocket: allow_websocket,
		});

		// Re-assign the route meta.
		Reflect.defineMetadata('routes', routes, target.constructor);
	}
}