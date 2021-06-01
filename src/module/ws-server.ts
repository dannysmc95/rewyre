import { HTTPServer } from './http-server';
import { IOptions } from '../interface/options';
import * as expressWs from 'express-ws';
import * as WS from 'ws';
import { Request } from 'express';
import { Router } from './router';
import { ErrorMessages } from '../enum/error-messages';
import { ServerHelper } from '../helper/server';
import { IContext } from '../interface/context';
import { ILogger } from '../interface/logger';
import { HookManager } from './hook-manager';

/**
 * The WSServer class controls the world of WebSocket servers, this
 * class manages the clients connected, and offers an open API to the
 * WSHelper class to control the WebSocket connections, alongside
 * providing an interface for the Services to also get involved, including
 * killing off dead or idle connections and helping with stats.
 */
export class WSServer {

	protected controllers: Array<any> = [];
	protected server!: expressWs.Application;
	protected connections: {[key: string]: {socket: WS, request: Request, subscriptions: Array<string>, session: any}} = {};
	protected helper: ServerHelper;

	/**
	 * Creates a new instance of the WebSocket server, which will
	 * augment the underlying HTTPServer and add it's own functionality
	 * on top for the WebSocket server, this functionality is powered by
	 * the `express-ws` package which in turn relies on the `ws` package.
	 * 
	 * @param options The framework options.
	 * @param http_server The HTTPServer instance.
	 * @param router The router instance.
	 * @param logger The logger instance.
	 * @returns WSServer.
	 */
	public constructor(protected options: IOptions, protected http_server: HTTPServer, protected router: Router, protected logger: ILogger, protected hooks: HookManager) {
		this.helper = new ServerHelper();
		const server: any = this.http_server.getInstance();
		expressWs(server);
		this.server = server;
	}

	/**
	 * This will take the controllers and assign them to the local class. and
	 * then create a WebSocket server and prepare to handle the ouputs by assigning
	 * the outputs to the correct local methods.
	 * 
	 * @param controllers The array of controllers.
	 * @returns void.
	 */
	public process(controllers: Array<any>): void {
		this.controllers = controllers;
		if (this.options.websocket) {
			this.initialise();
		}
	}

	/**
	 * This method returns an object, that is indexed by sec-websocket-key and
	 * contains the socket instance, the initial request, the subscriptions array
	 * and an open session object to assign data.
	 * 
	 * @returns Object.
	 */
	public getConnections(): {[key: string]: {socket: WS, request: Request, subscriptions: Array<string>, session: any}} {
		return this.connections;
	}

	/**
	 * Creates the WebSocket server and creates the events that the framework
	 * needs to listen to and then sends them to the correct local methods to
	 * be managed correctly.
	 * 
	 * @returns void.
	 */
	protected initialise(): void {
		this.server.ws(this.options.websocket_path || '/ws', (socket: WS, request: Request) => {

			// On Socket Open.
			this.onOpen(socket, request);

			// On socket close.
			socket.on('close', (code: number, reason: string) => {
				this.onClose(socket, request, code, reason);
			});

			// On socket error.
			socket.on('error', (err: Error) => {
				this.onError(socket, request, err);
			});

			// On socket message.
			socket.on('message', (message: string) => {
				this.onMessage(socket, request, message);
			});
		});
	}

	/**
	 * On connection open.
	 * 
	 * @param socket The socket instance.
	 * @param request The express request.
	 * @returns void.
	 */
	protected onOpen(socket: WS, request: Request): void {

		// Add to the connections object.
		const uniqueId = String(request.headers['sec-websocket-key']);
		this.connections[uniqueId] = {
			socket: socket,
			request: request,
			session: {},
			subscriptions: [],
		};

		// Notify console.
		this.logger.info('WEBSOCKET', `Connection received with ID: ${uniqueId}.`);
		this.logger.info('WEBSOCKET', `Information, connection count: ${Object.keys(this.connections).length}.`);
	}

	/**
	 * On connection close.
	 * 
	 * @param socket The socket instance.
	 * @param request The express request.
	 * @param code The close code.
	 * @param reason The reason for closure, can be empty.
	 * @returns void.
	 */
	protected onClose(socket: WS, request: Request, code: number, reason: string): void {
		const uniqueId = String(request.headers['sec-websocket-key']);
		delete this.connections[uniqueId];
		this.logger.info('WEBSOCKET', `Connection closed with code ${code}${reason !== '' ? ` and reason: ${reason}.` : '.'}`);
		this.logger.info('WEBSOCKET', `Information, connection count: ${Object.keys(this.connections).length}.`);
	}

	/**
	 * On connection error.
	 * 
	 * @param socket The socket instance.
	 * @param request The express request.
	 * @param err The connection error.
	 * @returns void.
	 */
	protected onError(socket: WS, request: Request, err: Error): void {
		const uniqueId = String(request.headers['sec-websocket-key']);
		delete this.connections[uniqueId];
		this.logger.error('WEBSOCKET', `Connection incurred an error: ${err.message}.`, err);
		this.logger.info('WEBSOCKET', `Information, connection count: ${Object.keys(this.connections).length}.`);
	}

	/**
	 * On connection message, send to handler.
	 * 
	 * @param socket The socket instance.
	 * @param request The express request.
	 * @param message The received message.
	 * @returns void.
	 */
	protected onMessage(socket: WS, request: Request, message: string): void {
		try {

			// Get the packet, parse it and validate it.
			const packet = JSON.parse(message);
			if (typeof packet.command === 'undefined') throw new Error(ErrorMessages.WEBSOCKET_INVALID_PACKET);

			// Now search for a valid controller and route and verify.
			const [ namespace, method ] = packet.command.split('/');
			const [ controller, route ] = this.getControllerAndRoute(namespace, method);
			if (controller === false || route === false) throw new Error(ErrorMessages.WEBSOCKET_NO_MATCH);

			// Check options and validate.
			const hasAccess: boolean = this.helper.checkWebSocketAccess(this.options, controller, route);
			if (!hasAccess) throw new Error(ErrorMessages.WEBSOCKET_NO_ACCESS);

			// Build a context.
			const context: IContext = {
				type: 'ws',
				ipAddress: request.socket.remoteAddress || '',
				headers: this.helper.convertObject(request.headers),
				cookies: this.helper.convertObject(request.cookies),
				params: this.helper.convertObject(request.params),
				query: Object.assign({ ws_command: packet.command }, this.helper.convertObject(request.query)),
				body: packet.content || {},
				authentication: false,
				getRaw: () => {
					return {
						request: request,
						socket: socket,
					};
				},
			};

			// Call the hook.
			this.hooks.dispatch('ws', context);

			// Pass to the dispatcher.
			this.router.dispatch(controller, route, context);

		} catch(err) {
			this.logger.error('WEBSOCKET', `There was an error processing the message: ${err.message}.`, err);
			socket.send(JSON.stringify({
				command: 'error',
				content: { status: false, message: ErrorMessages.WEBSOCKET_SERVER_ERROR },
			}));
		}
	}

	/**
	 * Will take the namespace and method and attempt to find the controller
	 * and route object to return back to the calling method to then process
	 * the request ready for the router to take it.
	 * 
	 * @param namespace The controller namespace.
	 * @param method The controller method.
	 * @returns Array<any>.
	 */
	protected getControllerAndRoute(namespace: string, method: string): Array<any> {
		let controller: any = false,
			route: any = false;

		for (const index in this.controllers) {
			if (this.controllers[index].namespace === namespace) {
				controller = this.controllers[index];
				const routes: Array<any> = this.controllers[index].routes;
				for (const rindex in routes) {
					if (routes[rindex].methodName === method) {
						route = routes[rindex];
					}
				}
			}
		}
		return [ controller, route ];
	}
}
