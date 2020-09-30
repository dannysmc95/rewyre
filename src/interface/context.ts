import { Request, Response } from 'express';
import * as WS from 'ws';

/**
 * The context interface defines the object that will be
 * given to every controller upon a matching request from
 * either the HTTP or WS server, this is a structured object
 * to allow you to make guarantees that the below data will
 * exist when you work on it.
 * 
 * @interface IContext
 */
export interface IContext {
	type: 'http' | 'ws',
	ipAddress: string,
	headers: any,
	cookies: any,
	params: any,
	query: any,
	body: any,
	getRaw: () => IContextRaw,
}

/**
 * The context raw interface defines the raw data given back
 * from either the HTTP server (Express) or the WebSocket
 * server (Express-WS), and therefore can be used to get round
 * limitations or do things that may not be possible witht he default
 * context object and is returned by calling `context.getRaw()`.
 * 
 * @interface IContextRaw
 */
export interface IContextRaw {
	request: Request,
	response?: Response,
	socket?: WS,
}