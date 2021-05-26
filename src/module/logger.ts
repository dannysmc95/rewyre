import { ILogger } from '../interface/logger';
import { yellow, red, cyan, grey, blue, green } from 'colors';

/**
 * The built-in simple logger, that simply routes all logs to the Console API.
 */
export class Logger implements ILogger {

	protected levels: Array<'info' | 'warn' | 'error' | 'verbose' | 'debug'>;

	/**
	 * This will create an instance of the logger with the given parameters.
	 * 
	 * @param levels The array of allowed levels to log.
	 */
	public constructor(allowedLevels?: Array<'info' | 'warn' | 'error' | 'verbose' | 'debug'>) {
		if (!allowedLevels) {
			this.levels = ['info', 'warn', 'error'];
		} else {
			this.levels = allowedLevels;
		}
	}

	/**
	 * Generic log method that takes a level and will route to the
	 * right method based on the level; passing over any given data.
	 * 
	 * @param level The level of the log.
	 * @param title The title of the output.
	 * @param message The contents of the output.
	 * @param err An error object (optional).
	 * @returns void.
	 */
	public log(level: 'info' | 'warn' | 'error' | 'verbose' | 'debug', title: string, message: string, err?: Error) {
		if (!this.levels.includes(level)) return;
		if (typeof this[level] === 'undefined' || !(this[level] instanceof Function)) return;
		this[level](title, message, err);
	}

	/**
	 * This method is to output information, like connection requests, or
	 * other, you should use the other methods to give more in-depth output.
	 * 
	 * @param title The title of the output.
	 * @param message The contents of the output.
	 * @returns void.
	 */
	public info(title: string, message: string): void {
		if (!this.levels.includes('info')) return;
		console.log(this.format(title, message, 'info'));
	}

	/**
	 * This method is to output warnings, like connection closes, or
	 * other, you should use the other methods to give more in-depth output.
	 * 
	 * @param title The title of the output.
	 * @param message The contents of the output.
	 * @returns void.
	 */
	public warn(title: string, message: string): void {
		if (!this.levels.includes('warn')) return;
		console.log(this.format(title, message, 'warn'));
	}

	/**
	 * This method is to output errors and optionally takes an error
	 * object, the built in logger is simple, but custom loggers can
	 * do more with that error message, like outputting the stack trace.
	 * 
	 * @param title The title of the output.
	 * @param message The contents of the output.
	 * @param err The error object.
	 * @returns void.
	 */
	public error(title: string, message: string, err?: Error): void {
		if (!this.levels.includes('error')) return;
		console.log(this.format(title, message, 'error', err));
	}

	/**
	 * This method is to output more verbose data, and is built for outputting
	 * objects and in general more information that would be useful.
	 * 
	 * @param title The title of the output.
	 * @param content The contents of the output.
	 * @param err The error object.
	 * @returns void.
	 */
	public verbose(title: string, message: string, err?: Error): void {
		if (!this.levels.includes('verbose')) return;
		console.log(this.format(title, message, 'verbose', err));
	}

	/**
	 * This method is to output debug information and should be used in conjunction
	 * with objects and more useful data that you can output, like outputting failing
	 * queries or other.
	 * 
	 * @param title The title of the output.
	 * @param content The contents of the output.
	 * @param err The error object.
	 * @returns void.
	 */
	public debug(title: string, content: any, err?: Error): void {
		if (!this.levels.includes('debug')) return;
		console.log(this.format(title, JSON.stringify(content), 'debug', err));
	}

	/**
	 * This method will simply format the message to be pretty and nice
	 * to read or can be used to customise more the output of certain output
	 * levels.
	 * 
	 * @param title The title of the output.
	 * @param message The contents of the output.
	 * @param err The error object.
	 * @returns void.
	 */
	protected format(title: string, message: string, level: 'info' | 'warn' | 'error' | 'verbose' | 'debug', err?: Error): string {
		const currentDate = new Date().toISOString();

		// Get the level text.
		let levelText = level.toUpperCase();
		if (['info', 'debug', 'verbose'].indexOf(level) > -1) levelText = blue(levelText);
		if (level === 'warn') levelText = yellow(levelText);
		if (level === 'error') levelText = red(levelText);

		// Return the formatted string.
		return `${grey(currentDate)} ${green('[')}${title.toUpperCase()}${green(']:')} ${levelText} ${cyan(message)}${err ? ` - ${red(err.message)}` : ''}`;
	}
}