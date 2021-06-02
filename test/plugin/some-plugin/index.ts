import { IPlugin } from '../../../src';
import { PluginController } from './controller';
import { onStart, onWebsocket } from './hooks';

// Define the plugin.
const plugin: IPlugin = {
	hooks: [
		{ type: 'ws', func: onWebsocket },
		{ type: 'start', func: onStart },
	],
	modules: [
		PluginController,
	],
	meta: {
		name: 'ExamplePlugin',
		config_name: 'example_plugin',
		version: '0.1.0',
		license: 'MIT',
		author: 'dannysmc95',
	},
};

export default plugin;
