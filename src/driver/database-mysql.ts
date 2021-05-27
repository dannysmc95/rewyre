import { IDatabaseDriver } from '../interface/database-driver';
import { IDatabaseItem } from '../interface/options';
import { createPool, escape, escapeId, Pool } from 'mysql';

/**
 * The database driver mysql class is the core driver that powers the MySQL/MariaDB support
 * for the framework and implements a subset of the core functionality with the addition
 * of being able to return the raw instance so that you can do more customised queries.
 */
export class DatabaseDriverMysql implements IDatabaseDriver {

	public engine = 'mysql';
	protected instance: any;

	/**
	 * Create an instance of the DatabaseDriverMysql class so that you can use this
	 * functionality into your framework, please be aware this class should never be
	 * called directly and only the framework will do this.
	 * 
	 * @param details The database config.
	 * @returns DatabaseDriverMysql.
	 */
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

	/**
	 * This method will attempt to find one document/record from the database that matches
	 * the given query criteria, and the options can be given a $projection property that defines
	 * what specific data you wish to return.
	 * 
	 * @param collection The collection name.
	 * @param query The query to search for.
	 * @param options Any options to pass (including projection).
	 * @returns Promise<any>.
	 */
	public async findOne(collection: string, query: any, options?: any): Promise<any> {
		const projection = options && options.$projection || false;
		const searchParams: Array<string> = Object.keys(query).map((key: string) => `${escapeId(key)} = ${escape(query[key])}`);
		const sqlQuery = `SELECT ${this.getProjection(projection)} FROM ${escapeId(collection)} ${Object.keys(query).length > 0 ? `WHERE ${searchParams.join(', ')}` : ''} LIMIT 1`;
		const response = await this.exec(sqlQuery);
		return response.results.length > 0 ? response.results[0] : null;
	}

	/**
	 * This method will attempt to find many documents/records from the database that matches
	 * the given query criteria, and the options can be given a $projection property that defines
	 * what specific data you wish to return.
	 * @param collection The collection name.
	 * @param query The query to search for.
	 * @param options Any options to pass (including projection).
	 * @returns Promise<any>.
	 */
	public async find(collection: string, query: any, options?: any): Promise<any[]> {
		const projection = options && options.$projection || false;
		const searchParams: Array<string> = Object.keys(query).map((key: string) => `${escapeId(key)} = ${escape(query[key])}`);
		const sqlQuery = `SELECT ${this.getProjection(projection)} FROM ${escapeId(collection)} ${Object.keys(query).length > 0 ? `WHERE ${searchParams.join(', ')}` : ''}`;
		const response = await this.exec(sqlQuery);
		return response.results;
	}

	/**
	 * This method will attempt to count all documents/records that match the given search
	 * criteria.
	 * 
	 * @param collection The collection name.
	 * @param query The query to search for.
	 * @returns Promise<number>.
	 */
	public async count(collection: string, query: any): Promise<number> {
		const searchParams: Array<string> = Object.keys(query).map((key: string) => `${escapeId(key)} = ${escape(query[key])}`);
		const sqlQuery = `SELECT COUNT(id) as countedIds FROM ${escapeId(collection)} ${Object.keys(query).length > 0 ? `WHERE ${searchParams.join(', ')}` : ''}`;
		const response = await this.exec(sqlQuery);
		return parseInt(response.results[0].countedIds);
	}

	/**
	 * Will insert a record to the database.
	 * 
	 * @param collection The collection name.
	 * @param record The record to insert.
	 * @returns Promise<string | number>.
	 */
	public async insertOne(collection: string, record: any): Promise<string | number> {
		const columns: Array<string> = Object.keys(record).map((key: string) => escapeId(key));
		const values: Array<any> = Object.values(record).map((value: any) => escape(value));
		const sqlQuery = `INSERT INTO ${escapeId(collection)} (${columns.join(', ')}) VALUES (${values.join(', ')})`;
		const response = await this.exec(sqlQuery, values);
		return parseInt(response.results.insertId);
	}

	/**
	 * Will insert many records to the database.
	 * 
	 * @param collection The collection name.
	 * @param records The record to insert.
	 * @returns Promise<string[] | number[]>.
	 */
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

	/**
	 * Will update one record to the database.
	 * 
	 * @param collection The collection name.
	 * @param query: The query to search for.
	 * @param update The update to make.
	 * @returns Promise<boolean>.
	 */
	public async updateOne(collection: string, query: any, update: any): Promise<boolean> {
		const searchParams: Array<string> = Object.keys(query).map((key: string) => `${escapeId(key)} = ${escape(query[key])}`);
		const updateParams: Array<string> = Object.keys(update).map((key: string) => `${escapeId(key)} = ${escape(update[key])}`);
		const sqlQuery = `UPDATE ${escapeId(collection)} SET ${updateParams.join(', ')} WHERE ${searchParams.join(' AND ')} LIMIT 1`;
		const response = await this.exec(sqlQuery);
		return response.results.affectedRows > 0;
	}

	/**
	 * Will update many records to the database.
	 * 
	 * @param collection The collection name.
	 * @param query: The query to search for.
	 * @param update The update to make.
	 * @returns Promise<boolean>.
	 */
	public async updateMany(collection: string, query: any, update: any): Promise<boolean> {
		const searchParams: Array<string> = Object.keys(query).map((key: string) => `${escapeId(key)} = ${escape(query[key])}`);
		const updateParams: Array<string> = Object.keys(update).map((key: string) => `${escapeId(key)} = ${escape(update[key])}`);
		const sqlQuery = `UPDATE ${escapeId(collection)} SET ${updateParams.join(', ')} WHERE ${searchParams.join(' AND ')}`;
		const response = await this.exec(sqlQuery);
		return response.results.affectedRows > 0;
	}

	/**
	 * Will delete one record from the database.
	 * 
	 * @param collection The collection name.
	 * @param query: The query to search for.
	 * @returns Promise<boolean>.
	 */
	public async deleteOne(collection: string, query: any): Promise<boolean> {
		const searchParams: Array<string> = Object.keys(query).map((key: string) => `${escapeId(key)} = ${escape(query[key])}`);
		const sqlQuery = `DELETE FROM ${escapeId(collection)} ${Object.keys(query).length > 0 ? `WHERE ${searchParams.join(', ')}` : ''} LIMIT 1`;
		const response = await this.exec(sqlQuery);
		return response.results.affectedRows > 0;
	}

	/**
	 * Will delete many records from the database.
	 * 
	 * @param collection The collection name.
	 * @param query: The query to search for.
	 * @returns Promise<boolean>.
	 */
	public async deleteMany(collection: string, query: any): Promise<boolean> {
		const searchParams: Array<string> = Object.keys(query).map((key: string) => `${escapeId(key)} = ${escape(query[key])}`);
		const sqlQuery = `DELETE FROM ${escapeId(collection)} ${Object.keys(query).length > 0 ? `WHERE ${searchParams.join(', ')}` : ''}`;
		const response = await this.exec(sqlQuery);
		return response.results.affectedRows > 0;
	}

	/**
	 * Will return the database instance directly for more customisation.
	 * 
	 * @returns Mysql.
	 */
	public getInstance(): any {
		return this.instance;
	}

	/**
	 * This will process the projection string, for use inside of a SELECT
	 * statement.
	 * 
	 * @param projection The projection to use.
	 * @returns string.
	 */
	protected getProjection(projection: any): string {
		if (projection === false) return '*';
		return Object.keys(projection).filter((key: string) => {
			if (projection[key] === 1) return key;
		}).join(', ');
	}

	/**
	 * Will execute an SQL query against the MySQL database.
	 * 
	 * @param query The SQL query to run.
	 * @param values The values to pass along.
	 * @returns Object/Array.
	 */
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
