import { IAny } from '../interface/any';
import { IPacket } from '../interface/packet';

/**
 * The packet class is used specifically for WebSockets and defines
 * a standard structure for WebSocket packets to be send back and forth
 * across the WebSocket transport.
 */
export class Packet {

	/**
	 * This creates a new packet and automatically converts it to a string ready
	 * for WebSocket transport.
	 * 
	 * @param command The command to send to the client.
	 * @param content The content specific to the command.
	 */
	public create(command: string, content: IAny): string {
		return JSON.stringify({
			command: command,
			content: content,
			created: new Date().valueOf(),
		});
	}

	/**
	 * This will parse a string into a packet format ready to be used
	 * within the application.
	 * 
	 * @param packet The packet received from the websocket.
	 */
	public parse(packet: string): IPacket {
		return JSON.parse(packet);
	}
}