import { IAny } from '../interface/any';
import { IOptions } from '../interface/options';

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
	public convertObject(current: IAny): IAny {
		const latest = {};
		for (const key in current) {
			latest[key] = current[key];
		}
		return latest;
	}

	/**
	 * This function will validate WebSocket access, depending on the
	 * framework settings, this will either check for full acces and then
	 * grant it, or check for partial and then check the controller and route
	 * each for access to the method.
	 * 
	 * @param options The framework options.
	 * @param controller The specific controller to verify.
	 * @param route The specific route to verify.
	 */
	public checkWebSocketAccess(options: IOptions, controller: IAny, route: IAny): boolean {
		if (!options.ws_enable) return false;
		if (options.ws_access === 'full') return true;
		if (controller.websocket && route.websocket) {
			return true;
		}
		return false;
	}
}