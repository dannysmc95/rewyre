export interface IPacket {
	command: string;
	created: number;
	content?: IPacketContent;
}

export interface IPacketContent {
	[key: string]: any;
}
