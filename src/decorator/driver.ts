/**
 * This decorator will define a class as a database driver and add
 * meta information to the class relating specifically to how to use
 * and import the class. A database driver allows you to specify your
 * own implementation of the driver to support any database you wish.
 * 
 * @param name The name of the driver (usually database name).
 * @returns Function
 */
export function Driver(name: string): any {
	return (target: any) => {

		// Define base class information.
		Reflect.defineMetadata('class_type', 'driver', target);
		Reflect.defineMetadata('name', name, target);
	};
}