import { IOptions } from '../interface/options';
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
			hostname: 'localhost',

			// Database Specific.
			db_enable: true,
			db_database: 'rewyre-application',
			db_port: 27017,
			db_hostname: 'localhost',
			db_authenticate: false,

			// WebSocket Specific.
			ws_enable: false,
			ws_path: '/ws',
			ws_access: 'full',

			// State Specific.
			state_flush_period: 30,
			state_storage_type: 'file',

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
	public inject(class_items: Array<any>, injectables: {models: Array<any>, providers: Array<any>, state: State}): void {
		class_items.forEach((class_item: any) => {

			// Create class instance.
			class_item.instance = new class_item.class();
			class_item.instance.state = injectables.state;

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
					}
				}
			});
		});
	}
}