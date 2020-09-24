/**
 * The options interface that defines the available
 * configuration options for the rewyre framework.
 * 
 * @interface IOptions
 */
export interface IOptions {

	/**
	 * Framework specific options.
	 */
	port?: number;
	hostname?: string;

	/**
	 * Database specific options.
	 */
	db_enable?: boolean;
	db_database?: string;
	db_authenticate?: boolean;
	db_hostname?: string;
	db_port?: number;
	db_username?: string;
	db_password?: string;

	/**
	 * WebSocket specific options.
	 */
	ws_enable?: boolean;
	ws_path?: string;
	ws_access?: 'full' | 'partial';

	/**
	 * Extra framework options.
	 */
	enable_audit?: boolean;
	enable_debug?: boolean;
}