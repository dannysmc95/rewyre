/**
 * The service interface defining how to create a service.
 */
export interface IService {
	execute: () => Promise<void>;
	[key: string]: any;
}
