/**
 * The Logger class is used to log out information, to the console
 * in a structured way, you can extend this class and add additional
 * functionality for your own use cases if required.
 */
export class Logger {

	/**
	 * This will create a new notice log item.
	 * 
	 * @param namespace The namespace.
	 * @param message The log message.
	 */
	public notice(namespace: string, message: string): void {
		console.log(`[${namespace}]: ${message}`);
	}

	/**
	 * This will create a new warning log item.
	 * 
	 * @param namespace The namespace.
	 * @param message The log message.
	 */
	public warn(namespace: string, message: string): void {
		console.warn(`[${namespace}]: ${message}`);
	}

	/**
	 * This will create a new error log item.
	 * 
	 * @param namespace The namespace.
	 * @param message The log message.
	 * @param err The raw error class.
	 */
	public error(namespace: string, message: string, err: Error): void {
		console.error(`[${namespace}]: ${message}`);
		console.error(err);
	}
}
