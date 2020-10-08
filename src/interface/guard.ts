import { Request } from 'express';

export interface IGuard {
	supports: (request: Request) => Promise<boolean>,
	getCredentials: (request: Request) => Promise<any>,
	getUser: (credentials: any) => Promise<any>,
	checkCredentials: (request: Request, credentials: any, user: any) => Promise<boolean>,
	onAuthenticationSuccess: (request: Request, credentials: any, user: any) => Promise<void>,
	onAuthenticationFailure: (request: Request, credentials: any, user?: any) => Promise<void>,
	[key: string]: any,
}