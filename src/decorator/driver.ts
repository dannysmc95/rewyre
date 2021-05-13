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
 */
 export function Driver(engine: string): any {
	return (target: any) => {

		// Define base class information.
		Reflect.defineMetadata('class_type', 'driver', target);
		Reflect.defineMetadata('engine', engine, target);
	}
}