import { IAny } from '../interface/any';
import { WSServer } from '../module/ws-server';
import { Packet } from './packet';

export class WSHelper {

	private wsserver?: WSServer;
	protected packet: Packet;

	constructor() {
		this.packet = new Packet();
	}

	public init(wsserver?: WSServer): void {
		this.wsserver = wsserver;
	}

	public broadcast(command: string, content: IAny): boolean {
		if (!this.wsserver) return false;
		const connections: Array<any> = this.wsserver.getConnections();
		const connectionKeys: Array<string> = Object.keys(connections);
		connectionKeys.forEach((connectionKey: string) => {
			const packet: string = this.packet.create(command, content);
			connections[connectionKey].socket.send(packet);
		});
		return true;
	}

	public publish(channel: string, command: string, content: IAny): boolean {
		if (!this.wsserver) return false;
		const connections: Array<any> = this.wsserver.getConnections();
		const connectionKeys: Array<string> = Object.keys(connections);
		connectionKeys.forEach((connectionKey: string) => {
			if (connections[connectionKey].subscriptions.includes(channel)) {
				const packet: string = this.packet.create(command, content);
				connections[connectionKey].socket.send(packet);
			}
		});
		return true;
	}
}