import { WSServer } from '../module/ws-server';
import { IOptions } from '../interface/options';

/**
 * The WSHelper class offers functionality to access the websocket
 * server allowing you to create applications where you can push updates
 * to your connected clients.
 */
export class WSHelper {

	/**
	 * This will create an isntance of the WSHelper class and will expect
	 * the options object and the WebSocket server class instance.
	 * 
	 * @param options The options object.
	 * @param server The websocket server instance.
	 */
	public constructor(protected options: IOptions, protected server: WSServer) {}

	/**
	 * This method will broadcast a message to all connected websocket
	 * clients using a simple loop of connected clients.
	 * 
	 * @param message The message to send.
	 * @returns boolean
	 */
	public broadcast(message: string): boolean {
		const connections = this.server.getConnections();
		Object.keys(connections).forEach(key => {
			connections[key].socket.send(message);
		});
		return true;
	}

	/**
	 * This method will send a message to a specific user that is identified
	 * with the given ID (sec-websocket-key).
	 * 
	 * @param id The unique websocket ID.
	 * @param message The message to send.
	 * @returns boolean
	 */
	public send(id: string, message: string): boolean {
		const connections = this.server.getConnections();
		if (typeof connections[id] === 'undefined') return false;
		connections[id].socket.send(message);
		return true;
	}
}
