import { Request, Response } from 'express';
import * as ws from 'ws';
import { IPacket } from './packet';

export interface IContext {
	headers: Array<string>,
	requestedUrl: string,
	httpMethod: string,
	ipAddress: string,
	params: IKVArray,
	query: IKVArray,
	cookies: IKVArray,
	body: any,
	packet?: IPacket,
	socket: any,
	auth_token: string,
	session: IKVArray,
	raw: IContextRaw,
	isWebSocket: boolean,
	setCookie: (name: string, value: string, maxAge?: number, httpOnly?: boolean, secure?: boolean) => boolean,
}

interface IKVArray {
	[key: string]: any,
}

interface IContextRaw {
	request: Request,
	response?: Response,
	socket?: ws,
}