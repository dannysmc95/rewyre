import { IAny } from '../interface/any';
import { IPacket } from '../interface/packet';

export class Packet {

	public create(command: string, content: IAny): string {
		return JSON.stringify({
			command: command,
			content: content,
			created: new Date().valueOf(),
		});
	}

	public parse(packet: string): IPacket {
		return JSON.parse(packet);
	}
}