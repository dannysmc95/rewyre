/**
 * The controller decorator is used to apply prefix and namespace routing controls to
 * controllers, this is used to help separate concerns between controllers. You must
 * always give a prefix which is used for express and is prepended to any route path
 * automatically, the namespace parameter is only used if websockets are enabled, and
 * allows you define a prefix for the command you will send over.
 * 
 * @param prefix The controller path prefix.
 * @param namespace [Optional] The namespace string for WebSocket.
 */
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