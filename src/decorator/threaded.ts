/**
 * The threaded decorator provides an interface to control threading
 * functionality against a class, this means that controllers can be
 * executed inside a thread, instead of using the main event loop.
 */
export function Threaded(): any {
	return (target: any) => {

		// Define the threaded status on the class.
		Reflect.defineMetadata('threaded', true, target);
	}
}