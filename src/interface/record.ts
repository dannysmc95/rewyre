/**
 * The record interface is a catch all for string key and any value.
 */
export interface IRecord extends Object {
	[key: string]: any;
}