export interface IRoute {
	path: string,
	requestMethod: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'UPDATE' | 'PUT' | 'OPTIONS',
	methodName: string,
	allow_websocket: boolean,
}