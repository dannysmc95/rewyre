import { Driver, IDatabaseDriver, IDatabaseItem } from '../../src/index';

@Driver('file')
export class DatabaseDriverFile implements IDatabaseDriver {
	public engine = 'redis';
	protected instance: any;

	public constructor(protected details: IDatabaseItem) {
		this.instance = {};
	}

	public async findOne(collection: string, query: any, options?: any): Promise<any> {
		console.log(collection, query, options);
		return {};
	}

	public async find(collection: string, query: any, options?: any): Promise<any[]> {
		console.log(collection, query, options);
		return [];
	}

	public async count(collection: string, query: any, options?: any): Promise<number> {
		console.log(collection, query, options);
		return 0;
	}

	public async insertOne(collection: string, record: any, options?: any): Promise<string | number> {
		console.log(collection, record, options);
		return '37f2a077-3c41-499b-bef5-9563e6117d32';
	}

	public async insertMany(collection: string, records: Array<any>, options?: any): Promise<string[] | number[]> {
		console.log(collection, records, options);
		return ['a83192a0-f0b9-4b65-88b2-2a34ce83d8fd'];
	}

	public async updateOne(collection: string, query: any, update: any, options?: any): Promise<boolean> {
		console.log(collection, query, options);
		return true;
	}

	public async updateMany(collection: string, query: any, update: any, options?: any): Promise<boolean> {
		console.log(collection, query, options);
		return true;
	}

	public async deleteOne(collection: string, query: any, options?: any): Promise<boolean> {
		console.log(collection, query, options);
		return true;
	}

	public async deleteMany(collection: string, query: any, options?: any): Promise<boolean> {
		console.log(collection, query, options);
		return true;
	}

	public getInstance(): any {
		return this.instance;
	}
}