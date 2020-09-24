import { HTTPServer } from './http-server';
import { IOptions } from '../interface/options';

/**
 * The WSServer class controls the world of WebSocket servers, this
 * class manages the clients connected, and offers an open API to the
 * WSHelper class to control the WebSocket connections, alongside
 * providing an interface for the Services to also get involved, including
 * killing off dead or idle connections and helping with stats.
 */
export class WSServer {

	/**
	 * Creates a new instance of the WebSocket server, which will
	 * augment the underlying HTTPServer and add it's own functionality
	 * on top for the WebSocket server, this functionality is powered by
	 * the `express-ws` package which in turn relies on the `ws` package.
	 * 
	 * @param options The framework options.
	 * @param http_server The HTTPServer instance.
	 */
	constructor(protected options: IOptions, protected http_server: HTTPServer) {}
}