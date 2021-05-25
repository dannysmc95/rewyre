/**
 * The options interface that defines the available
 * configuration options for the rewyre framework.
 * 
 * @interface IOptions
 * @param port The port the framework should use, defaults to 3000.
 * @param host The host the framework should use, defaults to localhost.
 * @param database Whether to enable database access, defaults to false.
 * @param databases An array of available databases.
 * @param drivers Defines which drivers should be enabled, should be prefixed like: 'DatabaseMysql',
 * @param websocket Whether to enable the websocket server, defaults to false.
 * @param websocket_path The path the websocket should run on, defaults to /ws.
 * @param websocket_access The access type the websocket uses for access controllers, defaults to partial.
 * @param state_flush_period The time in seconds that the state should flush changes to storage.
 * @param state_storage_type The type of storage, whether to use file or database, defaults to file.
 * @param state_storage_name The name of the storage engine if type is set to database, if not set and database type is set, will fallback to default.
 */
export interface IOptions {
	port?: number;
	host?: string;
	database?: boolean;
	databases?: Array<IDatabaseItem>;
	websocket?: boolean;
	websocket_path?: string;
	websocket_access?: 'full' | 'partial';
	state_flush_period?: number,
	state_storage_type?: 'file' | 'database',
	state_storage_name?: string;
}

/**
 * The database item interface is used to define a database instance, as of now
 * the framework supports Redis, MongoDB and MySQL, please note with redis/mongo
 * there is no reason to create tables and structures, but MySQL will require you
 * setup the database beforehand.
 * 
 * @param unique The unique name to give the database, only use if you are using multiple databases.
 * @param name The database name.
 * @param port The database port.
 * @param host The database host.
 * @param user The database user.
 * @param pass The database password.
 * @param driver The database driver to use.
 * @param default Is the default fallback database.
 */
export interface IDatabaseItem {
	unique: string;
	name?: string;
	port?: number;
	host?: string;
	user?: string;
	pass?: string;
	driver: string;
	workers?: number;
	default?: boolean;
	customDriver?: boolean;
}
