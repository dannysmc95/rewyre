import { IAny } from './any';

export interface IPacket {
	command: string;
	content: any;
	created?: number;
	persist?: IAny;
	[key: string]: any;
}