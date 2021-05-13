/**
 * Defines the structure of the database driver and how to implement it so
 * that anyone can build their own driver for the database.
 */
export interface IDatabaseDriver {
	engine: string;
	findOne: (collection: string, query: any, options?: any) => Promise<any>;
	find: (collection: string, query: any, options?: any) => Promise<any[]>;
	count: (collection: string, query: any, options?: any) => Promise<number>;
	insertOne: (collection: string, record: any, options?: any) => Promise<string | number>;
	insertMany: (collection: string, records: Array<any>, options?: any) => Promise<string[] | number[]>;
	updateOne: (collection: string, query: any, update: any, options?: any) => Promise<boolean>;
	updateMany: (collection: string, query: any, update: any, options?: any) => Promise<boolean>;
	deleteOne: (collection: string, query: any, options?: any) => Promise<boolean>;
	deleteMany: (collection: string, query: any, options?: any) => Promise<boolean>;
	getInstance: () => any;
}
