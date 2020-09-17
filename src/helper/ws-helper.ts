import { IAny } from '../interface/any';
import { WSServer } from '../module/ws-server';
import { Packet } from './packet';

/**
 * The WSHelper class contains various helper methods for managing the
 * global websocket system, including broadcasting and publishing controls
 * to use with channels for WebSocket controls.
 */
export class WSHelper {

	private wsserver?: WSServer;
	protected packet: Packet;

	constructor() {
		this.packet = new Packet();
	}

	/**
	 * Used to initialise the class with the websocket server instance.
	 * 
	 * @param wsserver The WSServer instance.
	 */
	public init(wsserver?: WSServer): void {
		this.wsserver = wsserver;
	}

	/**
	 * Used to broadcast a message to all connected clients to the websocket
	 * server.
	 * 
	 * @param command The command to broadcast.
	 * @param content The content relating to the command.
	 */
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

	/**
	 * Used to publish a message to all connected clients on a specific channel,
	 * channels are defined either via Headers or can be assigned later using
	 * the subscribe method.
	 * 
	 * @param channel The channel name to broadcast to.
	 * @param command The command to broadcast to the channel.
	 * @param content The content relating to the command.
	 */
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

	/**
	 * Used to subscribe a connection to a specific channel to get channel specific
	 * broadcasts.
	 * 
	 * @param channel The channel name to subcribe to.
	 * @param connection The connection instance to apply the subscription to.
	 */
	public subscribe(channel: string, connection: any): boolean {
		if (!this.wsserver) return false;
		if (!connection.subscriptions.includes(channel)) {
			connection.subscriptions.push(channel);
		}
		return true;
	}
}