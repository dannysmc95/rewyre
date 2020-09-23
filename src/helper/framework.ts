import { IOptions } from '../interface/options';

/**
 * The Framework helper, provides various functions that compliment the Framework
 * class, the helper allows me to abstract some of the functionality out of the
 * main class, to make sure the code is clean and readable.
 */
export class FrameworkHelper {

	/**
	 * This function merges the default options with the user
	 * provided options so that the user options can override
	 * the defaults.
	 * 
	 * @param options The framework options.
	 */
	public mergeOptions(options?: IOptions): IOptions {
		const defaultOptions: IOptions = {

			// Framework Specific.
			port: 3000,
			hostname: 'localhost',

			// Database Specific.
			db_enable: true,
			db_port: 27017,
			db_hostname: 'localhost',

			// WebSocket Specific.
			ws_enable: false,
			ws_path: '/ws',
			ws_access: 'full',

			// Extra Specific.
			enable_audit: false,
			enable_debug: false,
		}
		return Object.assign(defaultOptions, options);
	}

	/**
	 * Will capitalise the first letter of a string.
	 * 
	 * @param text The text to capitalise.
	 */
	public capitalise(text: string): string {
		return text.charAt(0).toUpperCase() + text.substring(1);
	}
}