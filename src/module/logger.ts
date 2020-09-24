export class Logger {

	public notice(namespace: string, message: string): void {
		console.log(`[${namespace}]: ${message}`);
	}

	public warn(namespace: string, message: string): void {
		console.warn(`[${namespace}]: ${message}`);
	}

	public error(namespace: string, message: string, err: Error): void {
		console.error(`[${namespace}]: ${message}`);
		console.error(err);
	}
}