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

	/**
	 * Creates an instance of the database class which contains and
	 * controls the management of the database, this class can be extended
	 * to add additional functionality.
	 * 
	 * @param options The framework options.
	 */
	constructor(protected options: IOptions) {
		this.logger = new Logger();
		this.buildDatabaseUri();
	}

	/**
	 * Will build a database URI from the given framework settings
	 * and will include authentication with the URI if available or
	 * if enabled through the framework settings.
	 */
	public buildDatabaseUri(): void {
		if (!this.options.db_authenticate) {
			this.database_uri = `mongodb://${this.options.db_hostname}:${this.options.db_password}/${this.options.db_database}`;
		} else {
			if (this.options.db_username && this.options.db_password) {
				this.database_uri = `mongodb://${this.options.db_username}:${this.options.db_password}@${this.options.db_hostname}:${this.options.db_password}/${this.options.db_database}`;
			}
		}
	}

	/**
	 * Initialises the database, this will actually make the initial
	 * request and then create a client and then a database connection
	 * defined by the settings, the default database is: `rewyre` and
	 * can be changed in the framework settings.
	 */
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

	/**
	 * Returns a collection from the Mongo database instance based
	 * on the given collection name, will create one if it does not
	 * exist.
	 * 
	 * @param collection_name The name of the collection.
	 */
	public getCollection(collection_name: string): Collection {
		return this.database.collection(collection_name);
	}
}