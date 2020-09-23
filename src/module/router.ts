import { IOptions } from '../interface/options';
import { HTTPServer } from './http-server';
import { Threader } from './threader';
import { WSServer } from './ws-server';

export class Router {

	protected threader: Threader;

	constructor(protected options: IOptions, protected http_server: HTTPServer, protected ws_server: WSServer) {
		this.threader = new Threader();
	}
}