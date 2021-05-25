/**
 * The guard decorator is used to define an Authenticator Guard which can be
 * registered with the platform to define available guards that the platform
 * can use. A guard will define whether it is supported by the current request
 * and if so, then how it will act, you can also inject models to guards or use
 * external functionality if required. The 
 * 
 * @param name The name of the guard.
 * @param isFallback Whether to use this guard always to fallback to.
 * @returns Function
 */
export function Guard(name: string, isFallback = false): any {
	return (target: any) => {

		// Define base class information.
		Reflect.defineMetadata('class_type', 'guard', target);
		Reflect.defineMetadata('name', name, target);
		Reflect.defineMetadata('is_fallback', isFallback, target);
		if (!Reflect.hasMetadata('injects', target)) Reflect.defineMetadata('injects', [], target);
	};
}
