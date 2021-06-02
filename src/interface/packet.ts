/**
 * The IPacket interface defines the structure of a packet
 * that is used by the WebSocket server for the framework.
 * 
 * @interface IPacket
 */
export interface IPacket {
	command: string;
	created: number;
	content?: IPacketContent;
}

/**
 * A simple catch all interface for the IPacket content
 * property.
 * 
 * @interface IPacketContent
 */
export interface IPacketContent {
	[key: string]: any;
}
