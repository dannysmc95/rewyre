/**
 * The route interface is used to define how the route
 * objects look and how they work and the available options.
 */
export interface IRoute {
	path: string,
	requestMethod: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'UPDATE' | 'PUT' | 'OPTIONS',
	methodName: string,
	allow_websocket: boolean,
}