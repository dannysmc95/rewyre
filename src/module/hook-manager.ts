import { ILogger } from '../interface/logger';
import { HookTypes } from '../type/general';

export class HookManager {

	protected hooks: {[key: string]: Array<Function>} = {
		init: [],
		register: [],
		start: [],
		http: [],
		ws: [],
		service: [],
	};

	/**
	 * Creates an instance of the HookManager with the given parameters.
	 * 
	 * @param logger The logger instance.
	 * @returns HookManager.
	 */
	public constructor(protected logger: ILogger) {}

	/**
	 * This method will register a hook against the hook manager, which will be called
	 * in turn, hooks should be registered as the first thing after creating an instance
	 * of the framework.
	 * 
	 * @param type The hook type to register against.
	 * @param func The function to call for this hook.
	 * @returns void.
	 */
	public register(type: HookTypes, func: Function): void {
		if (typeof this.hooks[type] === 'undefined') return;
		this.hooks[type].push(func);
	}

	/**
	 * This method dispatches a hook event, and will call the given hooks needed.
	 * 
	 * @param type The type of hook event.
	 * @param state The state of the hook.
	 * @param context The context relating to the hook event.
	 * @returns Promise<void>.
	 */
	public async dispatch(type: string, context: any): Promise<void> {

		// Validate the type and check for items.
		if (typeof this.hooks[type] === 'undefined' || this.hooks[type].length === 0) return;

		// Wrap in a try catch.
		try {

			// Loop the available hooks and map to a single promise.
			await Promise.all(this.hooks[type].map(async (hook: any) => {
				await hook(context, type);
			}));

		} catch(err) {
			this.logger.error('HOOKS', `There was an error processing the hook of type: ${type}.`, err);
		}
	}
}
