import { IAny } from '../interface/any';

/**
 * The Threader class is built for managing the threading functionality
 * for the framework to offer some security, the class manages the total
 * count of threads, also killing threads that go over the defined max time
 * and also managing a queue of threads to prevent too many threads being
 * spawned and killing the host server.
 */
export class Threader {

	/**
	 * This method will respond with a created thread, ready for
	 * the router, to take and call the required method.
	 * 
	 * @param controller The controller definition.
	 */
	public async getThread(controller: IAny): Promise<any> {
		console.log('Create Thread', controller);
		return {};
	}
}