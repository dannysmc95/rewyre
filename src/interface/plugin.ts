import { FrameworkModules, HookTypes } from '../type/general';

/**
 * The IPlugin interface defines the expected structure that
 * a plugin should export, including the modules, hooks, option
 * overrides and any defined configuration for the plugin.
 * 
 * @interface IPlugin
 */
export interface IPlugin {
	modules?: Array<FrameworkModules>;
	hooks?: Array<IPluginHook>;
	config?: IPluginConfig;
	meta: IPluginMeta;
}

/**
 * The IPluginHook interface defines a hook object that can be simply
 * registered, which takes a type, and a function/callback to run.
 * 
 * @interface IPluginHook
 */
export interface IPluginHook {
	type: HookTypes;
	func: Function;
}

/**
 * The plugin config is a generic catch all for any defined configuration.
 * 
 * @interface IPluginConfig
 */
export interface IPluginConfig {
	[key: string]: any;
}

/**
 * The plugin options definition for the IOptions interface.
 * 
 * @interface IPluginOptions
 */
export interface IPluginOptions {
	[key: string]: IPluginConfig;
}

/**
 * Defines the plugin's meta information.
 * 
 * @interface IPluginMeta
 */
export interface IPluginMeta {
	name: string;
	version: string;
	license: string;
	author: string;
	config_name: string;
	author_url?: string;
	author_email?: string;
}
