/**
 * The options interface the available options that can be
 * passed when instantiating a new instance of the server.
 */
export interface IOptions {
	port?: number;
	username?: string,
	password?: string,
	database?: string,
	hostname?: string,
	db_port?: number,
	websocket?: boolean,
	websocket_path?: string,
	debug?: boolean,
}