import { IOptions } from '../interface/options';
import { ILogger } from '../interface/logger';

/**
 * The registry is an open and available key value storage engine
 * for the framework, this registry is in memory, therefore it is
 * strongly recommend only to use for in-memory data you may need.
 */
export class Registry {

	protected registry: {[key: string]: any} = {};

	/**
	 * This will create an instance of registry with the given parameters, the
	 * registry is injected to every module as a built-in and data can be assigned
	 * as and when needed, also note this should is in-memory only.
	 * 
	 * @param logger The logger instance.
	 * @returns Registry.
	 */
	public constructor(protected options: IOptions, protected logger: ILogger) {}

	/**
	 * Set a new entry to the registry.
	 * 
	 * @param key The key name.
	 * @param value The value to store.
	 * @returns void.
	 */
	public set(key: string, value: any): void {
		this.registry[key] = value;
	}

	/**
	 * This method will get the entry name for that key if it exists, otherwise
	 * it will return false.
	 * 
	 * @param key The key name.
	 * @returns any.
	 */
	public get(key: string): any {
		if (typeof this.registry[key] === 'undefined') return null;
		return this.registry[key];
	}

	/**
	 * Returns whether the key exists.
	 * 	
	 * @param key The key name.
	 * @returns Boolean.
	 */
	public has(key: string): boolean {
		return typeof this.registry[key] === 'undefined';
	}

	/**
	 * Gets an array of keys that the registry has stored.
	 * 
	 * @returns Array<string>.
	 */
	public keys(): Array<string> {
		return Object.keys(this.registry);
	}

	/**
	 * Clears all keys and values from the registry, use with caution!
	 * 
	 * @returns void.
	 */
	public clear(): void {
		this.registry = {};
	}
}