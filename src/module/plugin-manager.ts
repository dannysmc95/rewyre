import { ILogger } from '../interface/logger';
import { IPlugin, IPluginOptions } from '../interface/plugin';
import { IOptions } from '../interface/options';
import { Framework } from './framework';

/**
 * The plugin manager manages and controls how plugins are registered
 * into the framework, alongside migrating and setting up any given modules,
 * hooks, option overrides and plugin-specific configuration.
 * 
 * @class PluginManager
 */
export class PluginManager {

	protected plugins: Array<IPlugin> = [];

	/**
	 * This will create a new instance of the PluginManager class alongside the
	 * given parameters.
	 * 
	 * @param logger The logger instance.
	 * @param framework The active framework instance.
	 */
	public constructor(protected options: IOptions, protected logger: ILogger, protected framework: Framework) {}

	/**
	 * This method takes a plugin and then registers it to the framework, by registering
	 * all given modules, hooks, option overrides and configuration.
	 * 
	 * @param plugin The plugin.
	 */
	public use(plugin: IPlugin): void {

		// Register the plugin to the manager.
		this.plugins.push(plugin);

		// Register any hooks.
		if (plugin.hooks) {
			plugin.hooks.forEach((hook) => {
				this.framework.registerHook(hook.type, hook.func);
			});
		}

		// Register all given modules.
		if (plugin.modules) {
			this.framework.register(plugin.modules);
		}

		// Apply any custom configuration to the main config object.
		if (plugin.config) {
			(this.options.plugins as IPluginOptions)[plugin.meta.config_name] = plugin.config;
		}
	}
}
