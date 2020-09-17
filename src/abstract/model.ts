import { Collection } from 'mongodb';
import { IRecord } from '../interface/record';
import { IModelQuery } from '../interface/model-query';
import { IModelDefinition } from '../interface/model-definition';
import { IValidateResponse } from '../interface/validate-response';

/**
 * The abstract model comes with various pre-defined functions for collection
 * management, and as with controllers can be extended and then the extending
 * class can be used for extending the actual model class, but make sure to extend
 * this class due to this class having the definitions and pre-built functions.
 */
export class AbstractModel {

	constructor(public definition: IModelDefinition, public collection: Collection) {}

	/**
	 * Used to find a single document.
	 * 
	 * @param query The query to pass.
	 */
	public async findOne(query: IModelQuery): Promise<IRecord | null> {
		return await this.collection.findOne(query);
	}

	/**
	 * Used to find any and all documents that match the query.
	 * 
	 * @param query The query to pass.
	 */
	public async find(query: IModelQuery): Promise<Array<IRecord>> {
		const results: Array<IRecord> = await this.collection.find(query).toArray();
		return results;
	}

	/**
	 * Inserts a single document.
	 * 
	 * @param record The record to pass.
	 */
	public async insertOne(record: IRecord): Promise<string> {
		const result: IValidateResponse = this.validate(record);
		if (result.valid) {
			const result: any = await this.collection.insertOne(record);
			return result.insertedId;
		} else {
			return String(result.reason);
		}
	}

	/**
	 * Used to insert many records.
	 * 
	 * @param records Array of multiple records to pass.
	 */
	public async insertMany(records: Array<IRecord>): Promise<Array<string> | string> {
		for (const index in records) {
			const result: IValidateResponse = this.validate(records[index]);
			if (!result.valid) return String(result.reason);
		}
		const result: any = await this.collection.insertMany(records);
		return Object.values(result.insertedIds);
	}

	/**
	 * Used to update a single document based on the query, with the given update.
	 * 
	 * @param query The query to search against.
	 * @param update The update changes to apply to the match.
	 */
	public async updateOne(query: IModelQuery, update: IRecord): Promise<boolean> {
		const result: any = await this.collection.updateOne(query, { $set: update }, { upsert: true });
		return (result.result.ok === 1 ? true : false);
	}

	/**
	 * Used to update many documents based on the query, with the given update.
	 * 
	 * @param query The query to search against.
	 * @param update The update changes to apply to the match.
	 */
	public async updateMany(query: IModelQuery, update: IRecord): Promise<boolean> {
		const result: any = await this.collection.updateMany(query, { $set: update }, { upsert: true });
		return (result.result.ok === 1 ? true : false);
	}

	/**
	 * Used to delete a single document based on the search query.
	 * 
	 * @param query The query to match against.
	 */
	public async deleteOne(query: IModelQuery): Promise<boolean> {
		const result: any = await this.collection.deleteOne(query);
		return (result.result.ok === 1 ? true : false);
	}

	/**
	 * Used to delete many documents based on the search query.
	 * 
	 * @param query The query to match against.
	 */
	public async deleteMany(query: IModelQuery): Promise<boolean> {
		const result: any = await this.collection.deleteMany(query);
		return (result.result.ok === 1 ? true : false);
	}

	/**
	 * Each model has a reference of the types availale, this function can be used to validate
	 * the model against the definition, this is used interally for insertions, but can be called
	 * in any controller to do manual verification.
	 * 
	 * @param record The record to validate.
	 */
	public validate(record: IRecord): IValidateResponse {
		for (const key in record) {
			const definition = (typeof this.definition.fields[key] !== 'undefined' ? this.definition.fields[key] : false);
			if (definition !== false) {
				if (typeof record[key] !== definition.replace('?', '')) {
					return { valid: false, reason: `The key: ${key} should be of type: ${definition.replace('?', '')}, not type: ${typeof record[key]}.` };
				}
			} else {
				return { valid: false, reason: `The key: ${key}, does not exist on this model.` };
			}
		}
		for (const fkey in this.definition.fields) {
			if (typeof record[fkey] === 'undefined' && String(this.definition.fields[fkey]).charAt(0) !== '?') {
				return { valid: false, reason: `Missing model key: ${fkey}.` };
			}
		}
		return { valid: true} ;
	}
}