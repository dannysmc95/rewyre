import { Collection, MongoClient, MongoError, Db } from 'mongodb';
import { IDatabaseDriver } from '../interface/database-driver';
import { IDatabaseItem } from '../interface/options';

export class DatabaseDriverMongo implements IDatabaseDriver {

	public engine = 'redis';
	protected instance: any;
	protected database_uri?: string;
	protected mongo_options: any = { useUnifiedTopology: true, useNewUrlParser: true };

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

	public async findOne(collection: string, query: any, options?: any): Promise<any> {
		const projection = options && options.$projection || false;
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		if (projection !== false) return await (dbCollection as any).findOne(query, options).project(projection);
		return await dbCollection.findOne(query, options);
	}

	public async find(collection: string, query: any, options?: any): Promise<any[]> {
		const projection = options && options.$projection || false;
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		if (projection !== false) return await (dbCollection as any).find(query, options).project(projection).toArray();
		return await dbCollection.find(query, options).toArray();
	}

	public async count(collection: string, query: any, options?: any): Promise<number> {
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		return (await dbCollection.countDocuments(query, options) as any);
	}

	public async insertOne(collection: string, record: any, options?: any): Promise<string | number> {
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		const result: any = await dbCollection.insertOne(record, options);
		return result.insertedId;
	}

	public async insertMany(collection: string, records: Array<any>, options?: any): Promise<string[] | number[]> {
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		const result: any = await dbCollection.insertMany(records, options);
		return (Object.values(result.insertedIds) as any);
	}

	public async updateOne(collection: string, query: any, update: any, options?: any): Promise<boolean> {
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		const result: any = await dbCollection.updateOne(query, { $set: update }, options);
		return (result.result.ok === 1 ? true : false);
	}

	public async updateMany(collection: string, query: any, update: any, options?: any): Promise<boolean> {
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		const result: any = await dbCollection.updateMany(query, { $set: update }, options);
		return (result.result.ok === 1 ? true : false);
	}

	public async deleteOne(collection: string, query: any, options?: any): Promise<boolean> {
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		const result: any = await dbCollection.deleteOne(query, options);
		return (result.result.ok === 1 ? true : false);
	}

	public async deleteMany(collection: string, query: any, options?: any): Promise<boolean> {
		const dbCollection: Collection = (this.instance as Db).collection(collection);
		const result: any = await dbCollection.deleteMany(query, options);
		return (result.result.ok === 1 ? true : false);
	}

	public getInstance(): any {
		return this.instance;
	}
}
