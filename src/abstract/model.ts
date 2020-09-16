import { Collection } from 'mongodb';
import { IRecord } from '../interface/record';
import { IModelQuery } from '../interface/model-query';
import { IModelDefinition } from '../interface/model-definition';
import { IValidateResponse } from '../interface/validate-response';

export class AbstractModel {

	constructor(public definition: IModelDefinition, public collection: Collection) {}

	public async findOne(query: IModelQuery): Promise<IRecord | null> {
		return await this.collection.findOne(query);
	}

	public async find(query: IModelQuery): Promise<Array<IRecord>> {
		const results: Array<IRecord> = await this.collection.find(query).toArray();
		return results;
	}

	public async insertOne(record: IRecord): Promise<string> {
		const result: IValidateResponse = this.validate(record);
		if (result.valid) {
			const result: any = await this.collection.insertOne(record);
			return result.insertedId;
		} else {
			return String(result.reason);
		}
	}

	public async insertMany(records: Array<IRecord>): Promise<Array<string> | string> {
		for (const index in records) {
			const result: IValidateResponse = this.validate(records[index]);
			if (!result.valid) return String(result.reason);
		}
		const result: any = await this.collection.insertMany(records);
		return Object.values(result.insertedIds);
	}

	public async updateOne(query: IModelQuery, update: IRecord): Promise<boolean> {
		const result: any = await this.collection.updateOne(query, { $set: update }, { upsert: true });
		return (result.result.ok === 1 ? true : false);
	}

	public async updateMany(query: IModelQuery, update: IRecord): Promise<boolean> {
		const result: any = await this.collection.updateMany(query, { $set: update }, { upsert: true });
		return (result.result.ok === 1 ? true : false);
	}

	public async deleteOne(query: IModelQuery): Promise<boolean> {
		const result: any = await this.collection.deleteOne(query);
		return (result.result.ok === 1 ? true : false);
	}

	public async deleteMany(query: IModelQuery): Promise<boolean> {
		const result: any = await this.collection.deleteMany(query);
		return (result.result.ok === 1 ? true : false);
	}

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