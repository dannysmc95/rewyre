import { WSServer } from '../module/ws-server';
import { IOptions } from '../interface/options';
import { ILogger } from '../interface/logger';
import { IPacket } from '../interface/packet';

/**
 * The WSHelper class offers functionality to access the websocket
 * server allowing you to create applications where you can push updates
 * to your connected clients.
 */
export class WSHelper {

	/**
	 * This will create an isntance of the WSHelper class and will expect
	 * the options object and the WebSocket server class instance.
	 * 
	 * @param options The options object.
	 * @param server The websocket server instance.
	 */
	public constructor(protected options: IOptions, protected server: WSServer, protected logger: ILogger) {}

	/**
	 * This method will broadcast a message to all connected websocket
	 * clients using a simple loop of connected clients, when used with
	 * subscriptions only users with a matching subscription will recieve
	 * the broadcasted packet.
	 * 
	 * @param message The message to send.
	 * @param subscriptions An array of subscriptions that can receive this message.
	 * @returns boolean
	 */
	public broadcast(message: string, subscriptions?: Array<string>): boolean {

		// Get connection list.
		const connections = this.server.getConnections();

		// Loop the connectins.
		Object.keys(connections).forEach(key => {

			// If subscriptions are given, validate whether the user is subscribed.
			if (subscriptions && subscriptions.length > 0) {
				let hasSubscription = false;
				subscriptions.forEach(sub => {
					if (connections[key].subscriptions.includes(sub)) {
						hasSubscription = true;
					}
				});

				// If user has matching subscription, send.
				if (hasSubscription) {
					connections[key].socket.send(message);
				}

			// Send the message (no subscriptions given).
			} else {
				connections[key].socket.send(message);
			}
		});

		// Return successful.
		return true;
	}

	/**
	 * This method will send a message to a specific user that is identified
	 * with the given ID (sec-websocket-key).
	 * 
	 * @param id The unique websocket key.
	 * @param message The message to send.
	 * @returns boolean
	 */
	public send(id: string, message: string): boolean {
		const connections = this.server.getConnections();
		if (typeof connections[id] === 'undefined') return false;
		connections[id].socket.send(message);
		return true;
	}

	/**
	 * Will create a format (IPacket) that you can then send via the websocket,
	 * you can create your own packet format, but this follows the built-in format
	 * that is in use for incoming requests.
	 * 
	 * @param command The command string.
	 * @param content The content for the command.
	 * @returns IPacket
	 */
	public createPacket(command: string, content: any): IPacket {
		return {
			command: command,
			created: new Date().valueOf(),
			content: content,
		};
	}

	/**
	 * This will send an IPacket object via the websocket to the given unique websocket
	 * key user, the content is stringified before being sent.
	 * 
	 * @param id The unique websocket key.
	 * @param packet The IPacket object to send.
	 * @returns boolean
	 */
	public sendPacket(id: string, packet: IPacket): boolean {
		const connections = this.server.getConnections();
		if (typeof connections[id] === 'undefined') return false;
		connections[id].socket.send(JSON.stringify(packet));
		return true;
	}

	/**
	 * This will send an IPacket object via the websocket to all connected clients, when
	 * used with subscriptions only users with a matching subscription will recieve the
	 * broadcasted packet.
	 * 
	 * @param packet The IPacket object to send.
	 * @param subscriptions An array of subscriptions that can receive this message.
	 * @returns boolean
	 */
	public broadcastPacket(packet: IPacket, subscriptions?: Array<string>): boolean {

		// Get connection list.
		const connections = this.server.getConnections();

		// Loop the connectins.
		Object.keys(connections).forEach(key => {

			// If subscriptions are given, validate whether the user is subscribed.
			if (subscriptions && subscriptions.length > 0) {
				let hasSubscription = false;
				subscriptions.forEach(sub => {
					if (connections[key].subscriptions.includes(sub)) {
						hasSubscription = true;
					}
				});

				// If user has matching subscription, send.
				if (hasSubscription) {
					connections[key].socket.send(JSON.stringify(packet));
				}

			// Send the message (no subscriptions given).
			} else {
				connections[key].socket.send(JSON.stringify(packet));
			}
		});

		// Return successful.
		return true;
	}

	/**
	 * This will add the given subscription string to the user's subscriptions.
	 * 
	 * @param id The unique websocket security key.
	 * @param subscription The subscription string.
	 * @returns boolean
	 */
	public addSubscription(id: string, subscription: string): boolean {
		const connections = this.server.getConnections();
		if (typeof connections[id] === 'undefined') return false;
		if (connections[id].subscriptions.includes(subscription)) return true;
		connections[id].subscriptions.push(subscription);
		return true;
	}

	/**
	 * This will remove the given subscription string from the user's subscriptions.
	 * 
	 * @param id The unique websocket security key.
	 * @param subscription The subscription string.
	 * @returns boolean
	 */
	public removeSubscription(id: string, subscription: string): boolean {
		const connections = this.server.getConnections();
		if (typeof connections[id] === 'undefined') return false;
		if (!connections[id].subscriptions.includes(subscription)) return true;
		const subscriptionIndex = connections[id].subscriptions.indexOf(subscription);
		connections[id].subscriptions.splice(subscriptionIndex, 1);
		return true;
	}

	/**
	 * This will check whether the user has the given subscription.
	 * 
	 * @param id The unique websocket security key.
	 * @param subscription The subscription string.
	 * @returns boolean
	 */
	public hasSubscription(id: string, subscription: string): boolean {
		const connections = this.server.getConnections();
		if (typeof connections[id] === 'undefined') return false;
		return connections[id].subscriptions.includes(subscription);
	}

	/**
	 * This will check whether the user has the given subscription.
	 * 
	 * @param id The unique websocket security key.
	 * @returns Array<string> | false
	 */
	public getSubscriptions(id: string): Array<string> | false {
		const connections = this.server.getConnections();
		if (typeof connections[id] === 'undefined') return false;
		return connections[id].subscriptions;
	}

	/**
	 * This will assign data to the user's session. Session data is
	 * only there for that connection and will be cleared on disconnect.
	 * 
	 * @param id The unique websocket security key.
	 * @param key The session key.
	 * @param value The value of the session key.
	 * @returns boolean
	 */
	public setSessionItem(id: string, key: string, value: any): boolean {
		const connections = this.server.getConnections();
		if (typeof connections[id] === 'undefined') return false;
		connections[id].session[key] = value;
		return true;
	}

	/**
	 * This will get data from the user's session.
	 * 
	 * @param id The unique websocket security key.
	 * @param key The session key.
	 * @returns any
	 */
	public getSessionItem(id: string, key: string): any {
		const connections = this.server.getConnections();
		if (typeof connections[id] === 'undefined') return false;
		if (typeof connections[id].session[key] === 'undefined') return false;
		return connections[id].session[key];
	}

	/**
	 * This will check whether the user has a certain session key.
	 * 
	 * @param id The unique websocket security key.
	 * @param key The session key.
	 * @returns boolean
	 */
	public hasSessionItem(id: string, key: string): boolean {
		const connections = this.server.getConnections();
		if (typeof connections[id] === 'undefined') return false;
		return typeof connections[id].session[key] === 'undefined';
	}

	/**
	 * This will get the user's session keys as an array.
	 * 
	 * @param id The unique websocket security key.
	 * @param key The session key.
	 * @returns Array<string> | false
	 */
	public getSessionKeys(id: string): Array<string> | false {
		const connections = this.server.getConnections();
		if (typeof connections[id] === 'undefined') return false;
		return Object.keys(connections[id].session);
	}
}
