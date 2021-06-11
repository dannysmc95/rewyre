import { Framework } from '../../../src/index';

export function onWebsocket(context: any): void {
	console.log('WebSocket Stuff', context);
}

export function onStart(state: string, framework: Framework): void {
	framework.getLogger().info('PLUGIN:HOOK', `Application hook executed for state: ${state}!`);
}
