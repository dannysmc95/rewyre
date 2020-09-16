import * as expressWs from 'express-ws';
import * as express from 'express';
import * as ws from 'ws';
import { AbstractController } from '../abstract/controller';
import { IOptions } from '../interface/options';

export class WSServer {

	protected connections: number = 0;

	constructor(protected options: IOptions, protected server: any, protected controllers: Array<AbstractController>, protected userModel: string) {}

	public async prepare(): Promise<void> {
		if (this.options.websocket) {
			await this.init();
		}
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
		console.log('Socket Connected', request);
	}

	private async onClose(socket: ws, request: express.Request, code: number, reason: string): Promise<void> {
		console.log('Socket Closed', code, reason);
	}

	private async onError(socket: ws, request: express.Request, err: Error): Promise<void> {
		console.log('Socket Error', err.message);
	}

	private async onMessage(socket: ws, request: express.Request, message: string): Promise<void> {
		console.log('Socket Message', message);
	}
}