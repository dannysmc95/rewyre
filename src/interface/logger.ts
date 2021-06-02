/**
 * Defines the base structure of a logger and the methods that are
 * expected by the framework and documentation.
 * 
 * @interface ILogger
 */
export interface ILogger {
	log: (level: 'info' | 'warn' | 'error' | 'verbose' | 'debug', title: string, message: string) => void;
	info: (title: string, message: string) => void;
	warn: (title: string, message: string) => void;
	error: (title: string, message: string, err?: Error) => void;
	verbose: (title: string, message: string, err?: Error) => void;
	debug: (title: string, message: string, err?: Error) => void;
}
