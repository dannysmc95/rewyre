import { IOptions } from '../interface/options';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { ILogger } from '../interface/logger';

/**
 * The state is a global object in which you can get and set data to
 * a larger object, this then get periodically flushed to the Mongo
 * database. The state allows you to create an out-of-the-box solution
 * for sharing data between controllers, models, services and providers.
 */
export class State {

	protected initialised = false;
	protected timer: any;
	protected state: any = {};
	protected file_path: string;

	/**
	 * Creates an instance of the state with the framework options.
	 * 
	 * @param options The framework options.
	 * @param logger The logger instance.
	 * @param collection The collection.
	 * @returns State.
	 */
	public constructor(protected options: IOptions, protected logger: ILogger) {
		this.createInterval();
		this.file_path = resolve(__dirname, '../../state.json');
	}

	/**
	 * Initialises the state object by either loading it from file, if
	 * it exists, or defining it as an empty object.
	 * 
	 * @returns Promise<void>.
	 */
	public async initialise(): Promise<void> {
		if (this.options.state_storage_type === 'in-memory') {
			this.state = {};
		} else {
			try {
				this.logger.verbose('STATE', 'Loading state from file.');
				const baseState: any = await fs.readFile(this.file_path, 'utf-8');
				this.state = JSON.parse(baseState);
			} catch(err) {
				this.logger.error('STATE', 'Failed to load the state from any external place, defaulting to empty.', err as Error);
				this.state = {};
			}
		}
	}

	/**
	 * This function will use the dot notation lookup to find the point
	 * in the state, and return the contents.
	 * 
	 * @param lookup The dot notation lookup.
	 * @returns any.
	 */
	public get(lookup: string): any {
		return this.dotExec(lookup, this.state);
	}

	/**
	 * This function will use the dot notation lookup to find the point
	 * in the state, the define the data.
	 * 
	 * @param lookup The dot notation lookup.
	 * @param data The data to set.
	 * @returns any.
	 */
	public set(lookup: string, data: any): any {
		return this.dotExec(lookup, this.state, data);
	}

	/**
	 * The core functionality that flushes the state to file or database
	 * depending on the options, this function is called periodically and
	 * it will attempt to flush the data to storage.
	 * 
	 * @returns Promise<void>.
	 */
	protected async flush(): Promise<void> {
		await fs.writeFile(this.file_path, JSON.stringify(this.state), 'utf-8');
	}

	/**
	 * Create the perdiodic interval for the flushing of the state, and
	 * uses the options as the base point.
	 * 
	 * @returns void.
	 */
	protected createInterval(): void {
		this.timer = setInterval(() => {
			if (this.options.state_storage_type === 'file') {
				this.flush();
			}
		}, this.options.state_flush_period);
	}

	/**
	 * This function will use dot notation to lookup and set data into the
	 * state using dot notation.
	 * 
	 * @param lookup The dot notation lookup.
	 * @param state The object state to work on.
	 * @param data The data to set if applied.
	 * @returns any.
	 */
	protected dotExec(lookup: any, state: any, data?: any): any {
		if (typeof lookup === 'string') {
			return this.dotExec(lookup.split('.'), state, data);
		} else if (lookup.length === 1 && data !== undefined) {
			return state[lookup[0]] = data;
		} else if (lookup.length === 0) {
			return state;
		} else {
			return this.dotExec(lookup.slice(1), state[lookup[0]], data);
		}
	}
}
