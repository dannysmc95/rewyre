import { Collection } from 'mongodb';
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
	 * @param collection The linked Mongo database collection.
	 * @param state The state module.
	 */
	constructor(public name: string, public type: string, public fields: any, public collection: Collection) {}

	/**
	 * Returns the collection used by this model, this can be used for more
	 * advanced searches, with filtering, and more, this has been done to
	 * prevent too much complexity in the base model.
	 */
	public getCollection(): Collection {
		return this.collection;
	}

	/**
	 * Used to find a single document.
	 * 
	 * @param query The query to pass.
	 * @param options Any options to pass.
	 */
	public async findOne(query: any, options?: any): Promise<any> {
		return await this.collection.findOne(query, options);
	}

	/**
	 * Used to find any and all documents that match the query.
	 * 
	 * @param query The query to pass.
	 * @param options Any options to pass.
	 */
	public async find(query: any, options?: any): Promise<any[]> {
		return await this.collection.find(query, options).toArray();
	}

	/**
	 * Used to count all documents matching the criteria.
	 * 
	 * @param query The query to pass.
	 * @param options Any options to pass.
	 */
	public async count(query: any, options?: any): Promise<number> {
		return (await this.collection.countDocuments(query, options) as any);
	}

	/**
	 * Inserts a single document.
	 * 
	 * @param record The record to pass.
	 * @param options Any options to pass.
	 */
	public async insertOne(record: any, options?: any): Promise<string> {
		const result: IValidateResponse = this.validate(record);
		if (result.valid) {
			const result: any = await this.collection.insertOne(record, options);
			return result.insertedId;
		} else {
			return String(result.reason);
		}
	}

	/**
	 * Used to insert many records.
	 * 
	 * @param records Array of multiple records to pass.
	 * @param options Any options to pass.
	 */
	public async insertMany(records: Array<any>, options?: any): Promise<string[] | string> {
		for (const index in records) {
			const result: IValidateResponse = this.validate(records[index]);
			if (!result.valid) return String(result.reason);
		}
		const result: any = await this.collection.insertMany(records, options);
		return Object.values(result.insertedIds);
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
		const result: any = await this.collection.updateOne(query, { $set: update }, options);
		return (result.result.ok === 1 ? true : false);
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
		const result: any = await this.collection.updateMany(query, { $set: update }, options);
		return (result.result.ok === 1 ? true : false);
	}

	/**
	 * Used to delete a single document based on the search query.
	 * 
	 * @param query The query to match against.
	 * @param options Any options to pass.
	 */
	public async deleteOne(query: any, options?: any): Promise<boolean> {
		const result: any = await this.collection.deleteOne(query, options);
		return (result.result.ok === 1 ? true : false);
	}

	/**
	 * Used to delete many documents based on the search query.
	 * 
	 * @param query The query to match against.
	 * @param options Any options to pass.
	 */
	public async deleteMany(query: any, options?: any): Promise<boolean> {
		const result: any = await this.collection.deleteMany(query, options);
		return (result.result.ok === 1 ? true : false);
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