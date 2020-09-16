import { Request, Response } from 'express';

export interface IContext {
	httpVersion: string,
	headers: Array<string>,
	requestedUrl: string,
	httpMethod: string,
	ipAddress: string,
	params: IKVArray,
	query: IKVArray,
	cookies: IKVArray,
	body: any,
	auth_token: string,
	session: IKVArray,
	raw: IContextRaw,
	setCookie: (name: string, value: string, maxAge?: number, httpOnly?: boolean, secure?: boolean) => boolean,
}

interface IKVArray {
	[key: string]: any,
}

interface IContextRaw {
	request: Request,
	response: Response,
}