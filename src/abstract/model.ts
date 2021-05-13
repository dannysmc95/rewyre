import { IDatabaseDriver } from '../interface/database-driver';
import { IValidateResponse } from '../interface/validate-response';

/**
 * The abstract model comes with various pre-defined functions for collection
 * management, and as with controllers can be extended and then the extending
 * class can be used for extending the actual model class, but make sure to extend
 * this class due to this class having the definitions and pre-built functions.
 */
export abstract class AbstractModel {

	/**
	 * Creates an instance of the class with the required pre-built functions
	 * for accessing the model's linked Mongo database collection.
	 * 
	 * @param name The model name.
	 * @param type The model type.
	 * @param fields The fields in the model.
	 * @param database The linked database driver instance.
	 * @param state The state module.
	 */
	constructor(public name: string, public type: string, public fields: any, public database: IDatabaseDriver) {}

	/**
	 * Returns the collection used by this model, this can be used for more
	 * advanced searches, with filtering, and more, this has been done to
	 * prevent too much complexity in the base model.
	 */
	public getInstance(): IDatabaseDriver {
		return this.database;
	}

	/**
	 * Used to find a single document.
	 * 
	 * @param query The query to pass.
	 * @param options Any options to pass.
	 */
	public async findOne(query: any, options?: any): Promise<any> {
		return await this.database.findOne(this.name, query, options);
	}

	/**
	 * Used to find any and all documents that match the query.
	 * 
	 * @param query The query to pass.
	 * @param options Any options to pass.
	 */
	public async find(query: any, options?: any): Promise<any[]> {
		return await this.database.find(this.name, query, options);
	}

	/**
	 * Used to count all documents matching the criteria.
	 * 
	 * @param query The query to pass.
	 * @param options Any options to pass.
	 */
	public async count(query: any, options?: any): Promise<number> {
		return await this.database.count(this.name, query, options);
	}

	/**
	 * Inserts a single document.
	 * 
	 * @param record The record to pass.
	 * @param options Any options to pass.
	 */
	public async insertOne(record: any, options?: any): Promise<string | number> {
		const result: IValidateResponse = this.validate(record);
		if (!result.valid) return String(result.reason);
		return await this.database.insertOne(this.name, record, options);
	}

	/**
	 * Used to insert many records.
	 * 
	 * @param records Array of multiple records to pass.
	 * @param options Any options to pass.
	 */
	public async insertMany(records: Array<any>, options?: any): Promise<number[] | string[]> {
		for (const index in records) {
			const result: IValidateResponse = this.validate(records[index]);
			if (!result.valid && result.reason) return [result.reason];
		}
		return await this.database.insertMany(this.name, records, options);
	}

	/**
	 * Used to update a single document based on the query, with the given update. If you
	 * want to use upset, then the third parameter should be: `{ upsert: true }`.
	 * 
	 * @param query The query to search against.
	 * @param update The update changes to apply to the match.
	 * @param options The options to apply to MongoDB.
	 */
	public async updateOne(query: any, update: any, options?: any): Promise<boolean> {
		return await this.database.updateOne(this.name, query, update, options);
	}

	/**
	 * Used to update many documents based on the query, with the given update. If you
	 * want to use upset, then the third parameter should be: `{ upsert: true }`.
	 * 
	 * @param query The query to search against.
	 * @param update The update changes to apply to the match.
	 * @param options The options to apply to MongoDB.
	 */
	public async updateMany(query: any, update: any, options?: any): Promise<boolean> {
		return await this.database.updateMany(this.name, query, update, options);
	}

	/**
	 * Used to delete a single document based on the search query.
	 * 
	 * @param query The query to match against.
	 * @param options Any options to pass.
	 */
	public async deleteOne(query: any, options?: any): Promise<boolean> {
		return await this.database.deleteOne(this.name, query, options);
	}

	/**
	 * Used to delete many documents based on the search query.
	 * 
	 * @param query The query to match against.
	 * @param options Any options to pass.
	 */
	public async deleteMany(query: any, options?: any): Promise<boolean> {
		return await this.database.deleteMany(this.name, query, options);
	}

	/**
	 * Each model has a reference of the types availale, this function can be used to validate
	 * the model against the definition, this is used interally for insertions, but can be called
	 * in any controller to do manual verification.
	 * 
	 * @param record The record to validate.
	 */
	public validate(record: any): IValidateResponse {

		// Remove any undefined values.
		const recordSorted: any = {};
		Object.keys(record).forEach((key: string) => {
			if (record[key] !== undefined) recordSorted[key] = record[key];
		});

		// Process the validation.
		for (const key in recordSorted) {
			const definition = (typeof this.fields[key] !== 'undefined' ? this.fields[key] : false);
			if (definition !== false) {
				if (typeof recordSorted[key] !== definition.replace('?', '')) {
					return { valid: false, reason: `The key: ${key} should be of type: ${definition.replace('?', '')}, not type: ${typeof recordSorted[key]}.` };
				}
			} else {
				return { valid: false, reason: `The key: ${key}, does not exist on this model.` };
			}
		}
		for (const fkey in this.fields) {
			if (typeof recordSorted[fkey] === 'undefined' && String(this.fields[fkey]).charAt(0) !== '?') {
				return { valid: false, reason: `Missing model key: ${fkey}.` };
			}
		}
		return { valid: true };
	}
}