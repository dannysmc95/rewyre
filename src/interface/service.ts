/**
 * The service interface defining how to create a service.
 * 
 * @interface IService
 */
export interface IService {
	execute: () => Promise<void>;
	[key: string]: any;
}
