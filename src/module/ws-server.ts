import { HTTPServer } from './http-server';
import { IOptions } from '../interface/options';

export class WSServer {

	constructor(protected options: IOptions, protected http_server: HTTPServer) {}
}