export function Driver(name: string): any {
	return (target: any) => {

		// Define base class information.
		Reflect.defineMetadata('class_type', 'driver', target);
		Reflect.defineMetadata('name', name, target);
	}
}