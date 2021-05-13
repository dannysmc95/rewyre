/**
 * The Route decorator is used specifically to create routes to each method automatically,
 * you would pass a method which is a HTTP method (the available methods for express): GET,
 * POST, UPDATE, PATCH, DELETE, OPTIONS, PUT, etc. Then the path is the path you define to
 * the method, this is appended after the controller prefix, and then whether to allow websocket
 * access to the method. The websocket methods are called differently and ignore the method
 * option and call it directly, and usually follows: <namespace>/<method_name>.
 * 
 * @param method The HTTP method as a string.
 * @param path The path to that method, is appended after the controller prefix.
 * @param websocket Whether to allow websocket connections to the method, defaults to false.
 * @returns Function
 */
export function Route(method: string, path: string, websocket = false): any {
	return (target: any, propertyKey: string): void => {

		// Check for empty routes, if they are undefined, define them.
		if (!Reflect.hasMetadata('routes', target.constructor)) {
			Reflect.defineMetadata('routes', [], target.constructor);
		}

		// Define the existing routes.
		const routes: Array<any> = Reflect.getMetadata('routes', target.constructor);

		// Create a new route for this method.
		routes.push({
			methodName: propertyKey,
			requestMethod: method.toLowerCase(),
			path: path,
			websocket: websocket,
		});

		// Re-assign the route meta.
		Reflect.defineMetadata('routes', routes, target.constructor);
	}
}