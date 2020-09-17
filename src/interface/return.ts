/**
 * The return interface defines the required response information
 * that can be sent back via the HTTP or WS servers.
 */
export interface IReturn {
	status: number,
	content?: any,
}