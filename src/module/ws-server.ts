import * as expressWs from 'express-ws';
import * as express from 'express';
import * as ws from 'ws';
import { AbstractController } from '../abstract/controller';
import { IOptions } from '../interface/options';
import { IPacket } from '../interface/packet';
import { IContext } from '..';

export class WSServer {

	protected connections = {};
	protected controllers?: Array<AbstractController> = [];

	constructor(protected options: IOptions, protected server: any, protected userModel: string) {}

	public async prepare(controllers: Array<AbstractController>): Promise<void> {
		this.controllers = controllers;
		if (this.options.websocket) {
			await this.init();
		}
	}

	public broadcast(packet: IPacket): boolean {
		console.log(packet);
		return true;
	}

	public getConnectionCount(): number {
		return Object.keys(this.connections).length;
	}

	public getConnections(): any {
		return this.connections;
	}

	private async init(): Promise<void> {

		// Enable WebSocket support.
		expressWs(this.server);

		// Define running class context.
		const context = this;

		// Now create the base/
		this.server.ws(this.options.websocket_path, async (socket: ws, request: express.Request) => {

			// On Socket Connection.
			context.onOpen(socket, request);

			// On socket close.
			socket.on('close', (code: number, reason: string) => {
				context.onClose(socket, request, code, reason);
			});

			// On socket error.
			socket.on('error', (err: Error) => {
				context.onError(socket, request, err);
			});

			// On socket message.
			socket.on('message', (message: string) => {
				context.onMessage(socket, request, message);
			});
		});
	}

	private async onOpen(socket: ws, request: express.Request): Promise<void> {

		// Define headers
		const headers: any = {};
		for (const index in request.headers) {
			headers[index] = request.headers[index];
		}

		// Define query
		const query: any = {};
		for (const index in request.query) {
			query[index] = request.query[index];
		}

		// Define params
		const params: any = {};
		for (const index in request.params) {
			params[index] = request.params[index];
		}

		// Define cookies
		const cookies: any = {};
		let auth_token = '';
		for (const index in request.cookies) {
			if (index === 'Rewyre-Auth') auth_token = request.cookies[index];
			cookies[index] = request.cookies[index];
		}

		// Create the object
		const context: IContext = {
			httpVersion: request.httpVersion,
			headers: headers,
			requestedUrl: request.url,
			httpMethod: request.method,
			ipAddress: request.socket.remoteAddress || '',
			params: params,
			query: query,
			cookies: cookies,
			body: request.body,
			auth_token: auth_token,
			isWebSocket: true,
			session: { logged_in: false, role: false },
			raw: { request: request, socket: socket },
			setCookie: (name: string, value: string, maxAge?: number, httpOnly?: boolean, secure?: boolean) => {
				const cookieParams: any = {};
				if (maxAge) cookieParams.maxAge = (1000 * 86400 * maxAge);
				if (httpOnly) cookieParams.httpOnly = httpOnly;
				if (secure) cookieParams.secure = secure;
				return true;
			}
		};

		// Add to the connections object.
		const uniqueId = String(request.headers['sec-websocket-key']);
		this.connections[uniqueId] = {
			socket: socket,
			context: context,
		};

		// Notify console.
		console.log(`WSS: Connection received with ID: ${uniqueId}.`);
		console.log(`WSS: Information, connection count: ${this.getConnectionCount()}.`);
	}

	private async onClose(socket: ws, request: express.Request, code: number, reason: string): Promise<void> {
		const uniqueId = String(request.headers['sec-websocket-key']);
		delete this.connections[uniqueId];
		console.log(`WSS: Connection closed with code ${code}${reason !== '' ? ` and reason: ${reason}.` : '.'}`);
		console.log(`WSS: Information, connection count: ${this.getConnectionCount()}.`);
	}

	private async onError(socket: ws, request: express.Request, err: Error): Promise<void> {
		const uniqueId = String(request.headers['sec-websocket-key']);
		delete this.connections[uniqueId];
		console.log(`WSS: Connection incurred an error: ${err.message}.`);
		console.log(`WSS: Information, connection count: ${this.getConnectionCount()}.`);
	}

	private async onMessage(socket: ws, request: express.Request, message: string): Promise<void> {
		console.log('Socket Message', message);
	}
}