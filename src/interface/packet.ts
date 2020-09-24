import { IAny } from './any';

/**
 * The packet inteface defines the structure for any
 * packets the platform uses.
 * 
 * @interface IPacket
 */
export interface IPacket {
	command: string;
	content: any;
	created?: number;
	persist?: IAny;
	[key: string]: any;
}