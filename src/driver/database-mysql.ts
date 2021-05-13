import { IDatabaseDriver } from '../interface/database-driver';
import { IDatabaseItem } from '../interface/options';
import { createPool, escape, escapeId, Pool } from 'mysql';

export class DatabaseDriverMysql implements IDatabaseDriver {

	public engine = 'mysql';
	protected instance: any;

	public constructor(protected details: IDatabaseItem) {

		// Create new instance.
		this.instance = createPool({
			host: this.details.host || 'localhost',
			port: this.details.port || 3306,
			user: this.details.user,
			password: this.details.pass,
			database: String(this.details.name),
			waitForConnections: true,
			queueLimit: 50,
			connectionLimit: this.details.workers || 8,
			multipleStatements: true,
		});
	}

	public async findOne(collection: string, query: any, options?: any): Promise<any> {
		const projection = options && options.$projection || false;
		const searchParams: Array<string> = Object.keys(query).map((key: string) => `${escapeId(key)} = ${escape(query[key])}`);
		const sqlQuery = `SELECT ${this.getProjection(projection)} FROM ${escapeId(collection)} ${Object.keys(query).length > 0 ? `WHERE ${searchParams.join(', ')}` : ''} LIMIT 1`;
		const response = await this.exec(sqlQuery);
		return response.results.length > 0 ? response.results[0] : null;
	}

	public async find(collection: string, query: any, options?: any): Promise<any[]> {
		const projection = options && options.$projection || false;
		const searchParams: Array<string> = Object.keys(query).map((key: string) => `${escapeId(key)} = ${escape(query[key])}`);
		const sqlQuery = `SELECT ${this.getProjection(projection)} FROM ${escapeId(collection)} ${Object.keys(query).length > 0 ? `WHERE ${searchParams.join(', ')}` : ''}`;
		const response = await this.exec(sqlQuery);
		return response.results;
	}

	public async count(collection: string, query: any): Promise<number> {
		const searchParams: Array<string> = Object.keys(query).map((key: string) => `${escapeId(key)} = ${escape(query[key])}`);
		const sqlQuery = `SELECT COUNT(id) as countedIds FROM ${escapeId(collection)} ${Object.keys(query).length > 0 ? `WHERE ${searchParams.join(', ')}` : ''}`;
		const response = await this.exec(sqlQuery);
		return parseInt(response.results[0].countedIds);
	}

	public async insertOne(collection: string, record: any): Promise<string | number> {
		const columns: Array<string> = Object.keys(record).map((key: string) => escapeId(key));
		const values: Array<any> = Object.values(record).map((value: any) => escape(value));
		const sqlQuery = `INSERT INTO ${escapeId(collection)} (${columns.join(', ')}) VALUES (${values.join(', ')})`;
		const response = await this.exec(sqlQuery, values);
		return parseInt(response.results.insertId);
	}

	public async insertMany(collection: string, records: Array<any>): Promise<string[] | number[]> {
		if (records.length === 0) return ['No records to insert.'];
		const columns: Array<string> = Object.keys(records[0]).map((key: string) => escapeId(key));
		const values = records.map((record: any) => Object.values(record).map((value: any) => escape(value)));
		const sqlQuery = `INSERT INTO ${escapeId(collection)} (${columns.join(', ')}) VALUES ${values.map((record: Array<any>) => `(${record.join(', ')})`).join(', ')}`;
		const response = await this.exec(sqlQuery);
		const insertedRowCount = parseInt(response.results.affectedRows);
		const currentLoop = parseInt(response.results.insertId);
		const returnIds: Array<number> = [];
		for (let i = currentLoop; i > (currentLoop - insertedRowCount); i--) {
			returnIds.push(i);
		}
		return returnIds;
	}

	public async updateOne(collection: string, query: any, update: any): Promise<boolean> {
		const searchParams: Array<string> = Object.keys(query).map((key: string) => `${escapeId(key)} = ${escape(query[key])}`);
		const updateParams: Array<string> = Object.keys(update).map((key: string) => `${escapeId(key)} = ${escape(update[key])}`);
		const sqlQuery = `UPDATE ${escapeId(collection)} SET ${updateParams.join(', ')} WHERE ${searchParams.join(' AND ')} LIMIT 1`;
		const response = await this.exec(sqlQuery);
		return response.results.affectedRows > 0;
	}

	public async updateMany(collection: string, query: any, update: any): Promise<boolean> {
		const searchParams: Array<string> = Object.keys(query).map((key: string) => `${escapeId(key)} = ${escape(query[key])}`);
		const updateParams: Array<string> = Object.keys(update).map((key: string) => `${escapeId(key)} = ${escape(update[key])}`);
		const sqlQuery = `UPDATE ${escapeId(collection)} SET ${updateParams.join(', ')} WHERE ${searchParams.join(' AND ')}`;
		const response = await this.exec(sqlQuery);
		return response.results.affectedRows > 0;
	}

	public async deleteOne(collection: string, query: any): Promise<boolean> {
		const searchParams: Array<string> = Object.keys(query).map((key: string) => `${escapeId(key)} = ${escape(query[key])}`);
		const sqlQuery = `DELETE FROM ${escapeId(collection)} ${Object.keys(query).length > 0 ? `WHERE ${searchParams.join(', ')}` : ''} LIMIT 1`;
		const response = await this.exec(sqlQuery);
		return response.results.affectedRows > 0;
	}

	public async deleteMany(collection: string, query: any): Promise<boolean> {
		const searchParams: Array<string> = Object.keys(query).map((key: string) => `${escapeId(key)} = ${escape(query[key])}`);
		const sqlQuery = `DELETE FROM ${escapeId(collection)} ${Object.keys(query).length > 0 ? `WHERE ${searchParams.join(', ')}` : ''}`;
		const response = await this.exec(sqlQuery);
		return response.results.affectedRows > 0;
	}

	public getInstance(): any {
		return this.instance;
	}

	protected getProjection(projection: any): string {
		if (projection === false) return '*';
		return Object.keys(projection).filter((key: string) => {
			if (projection[key] === 1) return key;
		}).join(', ');
	}

	protected async exec(query: string, values?: Array<any>): Promise<any> {
		return new Promise((resolve, reject) => {
			if (values && values.length > 0) {
				(this.instance as any).query(query, values, (err: Error, results: any, fields: any) => {
					if (err) reject(err);
					resolve({ results, fields });
				});
			} else {
				(this.instance as Pool).query(query, (err: Error, results: any, fields: any) => {
					if (err) reject(err);
					resolve({ results, fields });
				});
			}
		});
	}
}
