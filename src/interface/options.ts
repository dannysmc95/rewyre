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
	 * Email specific options.
	 */
	email_enable?: boolean;
	email_host?: string;
	email_port?: number;
	email_auth?: any;
	email_opt_pool?: boolean;
	email_opt_secure?: boolean;
	email_tls?: any;

	/**
	 * State specific options.
	 */
	state_flush_period?: number,
	state_storage_type?: 'file' | 'database',

	/**
	 * Extra framework options.
	 */
	enable_audit?: boolean;
	enable_debug?: boolean;
}