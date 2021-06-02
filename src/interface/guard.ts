import { Request } from 'express';

/**
 * Defines the guard and how to implement it, containing all expected
 * parameters and the return type.
 * 
 * @interface IGuard
 */
export interface IGuard {
	supports: (request: Request) => Promise<boolean>,
	getCredentials: (request: Request) => Promise<any>,
	getUser: (credentials: any) => Promise<any>,
	checkCredentials: (request: Request, credentials: any, user: any) => Promise<boolean>,
	onAuthenticationSuccess: (request: Request, credentials: any, user: any) => Promise<void>,
	onAuthenticationFailure: (request: Request, credentials: any, user?: any) => Promise<void>,
	[key: string]: any,
}
