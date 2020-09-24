import { IAny } from '../interface/any';

/**
 * The ServerHelper class gives support to the main HTTP and WS
 * servers by offering various functions to offload functions to
 * to here, so that the server files can be cleaner and much more
 * concise.
 */
export class ServerHelper {

	/**
	 * This method will loop all object properties and build a new
	 * object that does not have any specific type defined to it.
	 * 
	 * @param current The current object. 
	 */
	public convertObject(current: IAny): any {
		const latest = {};
		for (const key in current) {
			latest[key] = current[key];
		}
		return latest;
	}
}