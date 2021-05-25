/**
 * The controller decorator is used to apply prefix and namespace routing controls to
 * controllers, this is used to help separate concerns between controllers. You must
 * always give a prefix which is used for express and is prepended to any route path
 * automatically, the namespace parameter is only used if websockets are enabled, and
 * allows you define a prefix for the command you will send over.
 * 
 * @param prefix The controller path prefix.
 * @param namespace The namespace string for the controller.
 * @param websocket [Optional] Whether to allow WebSocket for this controller, only applicable when WebSocket is enabled.
 * @returns Function
 */
export function Controller(prefix: string, namespace: string, websocket = false): any {
	return (target: any) => {

		// Define base class information.
		Reflect.defineMetadata('class_type', 'controller', target);
		Reflect.defineMetadata('prefix', prefix, target);
		Reflect.defineMetadata('namespace', namespace, target);
		Reflect.defineMetadata('websocket', websocket, target);
		if (!Reflect.hasMetadata('routes', target)) Reflect.defineMetadata('routes', [], target);
		if (!Reflect.hasMetadata('injects', target)) Reflect.defineMetadata('injects', [], target);
	};
}
