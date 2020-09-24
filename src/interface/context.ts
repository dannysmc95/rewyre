import { IAny } from './any';
import { Request, Response } from 'express';
import * as WS from 'ws';

export interface IContext {
	type: 'http' | 'ws',
	ipAddress: string,
	headers: IAny,
	cookies: IAny,
	params: IAny,
	query: IAny,
	body: any,
	getRaw: () => IContextRaw,
}

export interface IContextRaw {
	request: Request,
	response?: Response,
	socket?: WS,
}