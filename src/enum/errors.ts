/**
 * Errors contains a series of available error methods and their
 * human description.
 */
export enum Errors {
	METHOD_UNAVAILABLE = 'The requested method is not available.',
	CONTROLLER_UNAVAILABLE = 'The requested controller is not found.',
	PACKET_ERROR = 'The given packet could not be processed.',
	NO_CONTROLLERS = 'There are no defined controllers.',
	WEBSOCKET_SERVER_ERROR = 'The server incurred an error while trying to process the WebSocket request.',
}