import { Collection, MongoClient, MongoError, Db } from 'mongodb';
import { ErrorMessages } from '../enum/error-messages';
import { IOptions } from '../interface/options';
import { Logger } from './logger';

/**
 * The database class is used specifically for the Mongo database
 * engine and will initialise and prepare the database to create a
 * usable instance in which the framework can get new collections
 * for the models to use.
 */
export class Database {

	protected database!: Db;
	protected logger: Logger;
	protected database_uri!: string;
	protected mongo_options: any = { useUnifiedTopology: true, useNewUrlParser: true };

	constructor(protected options: IOptions) {
		this.logger = new Logger();
		this.buildDatabaseUri();
	}

	public buildDatabaseUri(): void {
		if (!this.options.db_authenticate) {
			this.database_uri = `mongodb://${this.options.db_hostname}:${this.options.db_password}/${this.options.db_database}`;
		} else {
			if (this.options.db_username && this.options.db_password) {
				this.database_uri = `mongodb://${this.options.db_username}:${this.options.db_password}@${this.options.db_hostname}:${this.options.db_password}/${this.options.db_database}`;
			}
		}
	}

	public async initialise(): Promise<void> {
		await new Promise((resolve) => {
			try {
				MongoClient.connect(this.database_uri, this.mongo_options, (err: MongoError, client: MongoClient) => {
					if (err) throw new Error(ErrorMessages.DATABASE_CONNECTION_FAILED);
					const mongo_instance: MongoClient = client;
					this.database = mongo_instance.db(this.options.db_database);
					resolve(true);
				});
			} catch(err) {
				this.logger.error('DATABASE', err.message, err);
			}
		});
	}

	public getCollection(collection_name: string): Collection {
		return this.database.collection(collection_name);
	}
}