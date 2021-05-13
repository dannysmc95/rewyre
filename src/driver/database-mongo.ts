import { Collection, MongoClient, MongoError, Db } from 'mongodb';
import { IDatabaseDriver } from '../interface/database-driver';
import { IDatabaseItem } from '../interface/options';

/**
 * The database driver mongo class is the core driver that powers the MongoDB support
 * for the framework and implements a subset of the core functionality with the addition
 * of being able to return the raw instance so that you can do more customised queries.
 */
export class DatabaseDriverMongo implements IDatabaseDriver {

	public engine = 'redis';
	protected instance: any;
	protected database_uri?: string;
	protected mongo_options: any = { useUnifiedTopology: true, useNewUrlParser: true };

	/**
	 * Create an instance of the DatabaseDriverMongo class so that you can use this
	 * functionality into your framework, please be aware this class should never be
	 * called directly and only the framework will do this.
	 * 
	 * @param details The database config.
	 */
	public constructor(protected details: IDatabaseItem) {
		try {
			// Define the connection URI.
			if (this.details.user && this.details.pass) {
				this.database_uri = `mongodb://${this.details.user}:${this.details.pass}@${this.details.host}:${this.details.port}/${this.details.name}`;
			} else {
				this.database_uri = `mongodb://${this.details.host}:${this.details.port}/${this.details.name}`;
			}

			// Create the client.
			MongoClient.connect(this.database_uri, this.mongo_options, (err: MongoError, client: MongoClient) => {
				if (err) throw err;
				const mongoInstance: MongoClient = client;
				this.instance = mongoInstance.db(this.details.name);
			});
		} catch(err) {
			throw new Error(err);
		}
	}

	/**
	 * This method will attempt to find one document/record from the database that matches
	 * the given query criteria, and the options can be given a $projection property that defines
	 * what specific data you wish to return.
	 * 
	 * @param collection The collection name.
	 * @param query The query to search for.
	 * @param options Any options to pass (including projection).
	 * @returns Promise<any>
	 */
	public async findOne(collection: string, query: any, options?: any): Promise<any> {
		const projection = options && options.$projection || false;
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		if (projection !== false) return await (dbCollection as any).findOne(query, options).project(projection);
		return await dbCollection.findOne(query, options);
	}

	/**
	 * This method will attempt to find many documents/records from the database that matches
	 * the given query criteria, and the options can be given a $projection property that defines
	 * what specific data you wish to return.
	 * @param collection The collection name.
	 * @param query The query to search for.
	 * @param options Any options to pass (including projection).
	 * @returns Promise<any>
	 */
	public async find(collection: string, query: any, options?: any): Promise<any[]> {
		const projection = options && options.$projection || false;
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		if (projection !== false) return await (dbCollection as any).find(query, options).project(projection).toArray();
		return await dbCollection.find(query, options).toArray();
	}

	/**
	 * This method will attempt to count all documents/records that match the given search
	 * criteria.
	 * 
	 * @param collection The collection name.
	 * @param query The query to search for.
	 * @param options Any options to pass.
	 * @returns Promise<number>
	 */
	public async count(collection: string, query: any, options?: any): Promise<number> {
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		return (await dbCollection.countDocuments(query, options) as any);
	}

	/**
	 * Will insert a record to the database.
	 * 
	 * @param collection The collection name.
	 * @param record The record to insert.
	 * @param options Any options to pass.
	 * @returns Promise<string | number>
	 */
	public async insertOne(collection: string, record: any, options?: any): Promise<string | number> {
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		const result: any = await dbCollection.insertOne(record, options);
		return result.insertedId;
	}

	/**
	 * Will insert many records to the database.
	 * 
	 * @param collection The collection name.
	 * @param records The record to insert.
	 * @param options Any options to pass.
	 * @returns Promise<string[] | number[]>
	 */
	public async insertMany(collection: string, records: Array<any>, options?: any): Promise<string[] | number[]> {
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		const result: any = await dbCollection.insertMany(records, options);
		return (Object.values(result.insertedIds) as any);
	}

	/**
	 * Will update one record to the database.
	 * 
	 * @param collection The collection name.
	 * @param query: The query to search for.
	 * @param update The update to make.
	 * @param options Any options to pass.
	 * @returns Promise<boolean>
	 */
	public async updateOne(collection: string, query: any, update: any, options?: any): Promise<boolean> {
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		const result: any = await dbCollection.updateOne(query, { $set: update }, options);
		return (result.result.ok === 1 ? true : false);
	}

	/**
	 * Will update many records to the database.
	 * 
	 * @param collection The collection name.
	 * @param query: The query to search for.
	 * @param update The update to make.
	 * @param options Any options to pass.
	 * @returns Promise<boolean>
	 */
	public async updateMany(collection: string, query: any, update: any, options?: any): Promise<boolean> {
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		const result: any = await dbCollection.updateMany(query, { $set: update }, options);
		return (result.result.ok === 1 ? true : false);
	}

	/**
	 * Will delete one record from the database.
	 * 
	 * @param collection The collection name.
	 * @param query: The query to search for.
	 * @param options Any options to pass.
	 * @returns Promise<boolean>
	 */
	public async deleteOne(collection: string, query: any, options?: any): Promise<boolean> {
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		const result: any = await dbCollection.deleteOne(query, options);
		return (result.result.ok === 1 ? true : false);
	}

	/**
	 * Will delete many records from the database.
	 * 
	 * @param collection The collection name.
	 * @param query: The query to search for.
	 * @param options Any options to pass.
	 * @returns Promise<boolean>
	 */
	public async deleteMany(collection: string, query: any, options?: any): Promise<boolean> {
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		const result: any = await dbCollection.deleteMany(query, options);
		return (result.result.ok === 1 ? true : false);
	}

	/**
	 * Will return the database instance directly for more customisation.
	 * 
	 * @returns The database instance.
	 */
	public getInstance(): any {
		return this.instance;
	}
}
