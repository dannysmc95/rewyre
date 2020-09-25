export interface IService {
	execute: () => Promise<void>;
	[key: string]: any;
}