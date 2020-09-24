/**
 * The provide decorator defines an interface for creating pre-initialised
 * classes and including them into your instance, you can define them as single
 * for a single instance per each injected class, or shared which will create a
 * single instance for all injected classes.
 * 
 * @param name The name of the provider.
 * @param type The type of initialisation.
 */
export function Provide(name: string, type: 'single' | 'shared' = 'shared'): any {
	return (target: any) => {

		// Define base class information.
		Reflect.defineMetadata('class_type', 'provider', target);
		Reflect.defineMetadata('name', name, target);
		Reflect.defineMetadata('type', type, target);
	}
}