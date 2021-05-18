import { IDatabaseItem, IOptions } from '../interface/options';
import { State } from '../module/state';

/**
 * The Framework helper, provides various functions that compliment the Framework
 * class, the helper allows for abstraction of some functionality out of the main
 * class, to make sure the code is clean and readable.
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
			host: 'localhost',

			// Database Specific.
			database: false,
			databases: [],

			// WebSocket Specific.
			websocket: false,
			websocket_path: '/ws',
			websocket_access: 'partial',

			// State Specific.
			state_flush_period: 30,
			state_storage_type: 'file',
		}
		const mergedOptions: IOptions = Object.assign(defaultOptions, options);
		this.validateOptions(mergedOptions);
		return mergedOptions;
	}

	/**
	 * Specifically validates the database options given to make sure there is at least one default.
	 * 
	 * @param options The framework options.
	 */
	public validateOptions(options: IOptions): void {
		
		// Validate database.
		if (options.database === true) {
			let hasDefault = false;
			options.databases?.forEach((database: IDatabaseItem) => {
				if (database.default === true) hasDefault = true;
			});
			if (!hasDefault) throw new Error('At least one database must be set as default.');
		}
	}

	/**
	 * Will capitalise the first letter of a string.
	 * 
	 * @param text The text to capitalise.
	 */
	public capitalise(text: string): string {
		return text.charAt(0).toUpperCase() + text.substring(1);
	}

	/**
	 * This takes an array of objects, and will search against each object
	 * to find the "name" property and check if it matches.
	 * 
	 * @param classItems The definitions to search.
	 * @param className The definition to find.
	 */
	public findMatching(classItems: Array<any>, className: string): any {
		for (const index in classItems) {
			if (typeof classItems[index].name !== 'undefined' && classItems[index].name === className) {
				return classItems[index];
			}
		}
		return false;
	}

	/**
	 * This method will take an array of classes and a series of injectable
	 * that will be used to inject "injectable" classes, this includes models
	 * and providers at the moment.
	 * 
	 * @param class_items The array of classes to inject to.
	 * @param injectables The injectables available.
	 */
	public inject(class_items: Array<any>, injectables: {models: Array<any>, providers: Array<any>, state: State, options: IOptions}): void {
		class_items.forEach((class_item: any) => {

			// Create class instance.
			if (!class_item.instance) class_item.instance = new class_item.class();
			class_item.instance.state = injectables.state;
			class_item.instance.options = injectables.options;

			// Proceed only if there are injections available.
			if (class_item.injects.length === 0) return;

			// Let's look for any matching injectable classes.
			class_item.injects.forEach((inject_name: string) => {

				// Search for a model to inject.
				const model: any = this.findMatching(injectables.models, inject_name);
				if (model !== false) class_item.instance[inject_name] = model.instance;

				// Search for a provider to inject.
				const provider: any = this.findMatching(injectables.providers, inject_name);
				if (provider !== false) {
					if (provider.type === 'shared') {
						class_item.instance[inject_name] = provider.instance;
					} else if (provider.type === 'single') {
						class_item.instance[inject_name] = new provider.class();
						class_item.instance[inject_name].state = injectables.state;
						class_item.instance[inject_name].options = injectables.options;
					}
				}
			});
		});
	}
}