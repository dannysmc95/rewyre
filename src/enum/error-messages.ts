/**
 * The ErrorMessages enum contains all application
 * level error messages that we are aware of and are
 * pre-defined with useful messages.
 */
export enum ErrorMessages {
	NO_CLASS_TYPE 					= 'Provided class does not have a valid class type.',
	DATABASE_CONNECTION_FAILED 		= 'Failed to connect to the database.',
	ENDPOINT_NOT_FOUND				= 'The requested endpoint can not be found.',
	SERVER_ERROR					= 'The server has encountered an error trying to process your request.',
	THREAD_SPAWN_FAIL				= 'The thread failed to spawn due to an internal error.',
}