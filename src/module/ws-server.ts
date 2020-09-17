import * as expressWs from 'express-ws';
import * as express from 'express';
import * as ws from 'ws';
import { AbstractController } from '../abstract/controller';
import { IOptions } from '../interface/options';
import { IPacket } from '../interface/packet';
import { IContext, IReturn } from '..';
import { Packet } from '../helper/packet';
import { Errors } from '../enum/errors';

export class WSServer {

	protected connections = {};
	protected controllers?: Array<any> = [];
	protected packet: Packet;

	constructor(protected options: IOptions, protected server: any) {
		this.packet = new Packet();
	}

	public async prepare(controllers: Array<any>): Promise<void> {
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

	private buildContext(socket: ws, request: express.Request, packet: IPacket): IContext {

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
		return {
			headers: headers,
			requestedUrl: request.url,
			httpMethod: request.method,
			ipAddress: request.socket.remoteAddress || '',
			params: params,
			query: query,
			cookies: cookies,
			body: packet.content,
			socket: socket,
			packet: packet,
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
	}

	private onOpen(socket: ws, request: express.Request): void {

		// Add to the connections object.
		const uniqueId = String(request.headers['sec-websocket-key']);
		this.connections[uniqueId] = {
			socket: socket,
			request: request,
			subscriptions: [],
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
		try {
			const packet: IPacket = this.packet.parse(message);
			if (this.connections[String(request.headers['sec-websocket-key'])] !== 'undefined') {
				const context: IContext = this.buildContext(socket, request, packet);
				this.handleRequest(packet, this.connections[String(request.headers['sec-websocket-key'])], context);
			} else {
				throw new Error(Errors.PACKET_ERROR);
			}
		} catch(err) {
			socket.send(this.packet.create('error', {
				status: false,
				error: err.message,
			}));
			socket.close();
		}
	}

	private async handleRequest(packet: IPacket, connection: any, context: IContext): Promise<void> {
		try {

			// Check for available controllers.
			if (!this.controllers || this.controllers.length > 0) {
				throw new Error(Errors.CONTROLLER_UNAVAILABLE);
			}

			// Convert command.
			const [ namespace, method ] = packet.command.split('/');

			// Check to see if controller is available.
			if (typeof this.controllers[namespace] === 'undefined') {
				throw new Error(Errors.CONTROLLER_UNAVAILABLE);
			}

			// Check to see if method is available.
			if (!this.controllers[namespace].methods.includes(method)) {
				throw new Error(Errors.METHOD_UNAVAILABLE);
			}

			// Wrap the call in a try, catch.
			try {

				// Execute the request and catch the response.
				const result: IReturn = await this.controllers[namespace].instance[method](context);
				const content: any = result.content;
				content.statusCode = result.status;
				content.status = true;
				const response: string = this.packet.create(packet.command, content);
				connection.socket.send(response);

			} catch(err) {
				console.error(err);
				throw new Error(Errors.WEBSOCKET_SERVER_ERROR);
			}

		} catch(err) {
			connection.socket.send(this.packet.create(packet.command, {
				status: false,
				error: err.message,
			}));
		}
	}
}