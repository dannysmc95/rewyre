import { IDatabaseDriver } from '../interface/database-driver';
import { IDatabaseItem, IOptions } from '../interface/options';
import { Logger } from './logger';
import { resolve } from 'path';

/**
 * The database class is used specifically for the Mongo database
 * engine and will initialise and prepare the database to create a
 * usable instance in which the framework can get new collections
 * for the models to use.
 */
export class Database {

	protected drivers: Map<string, any> = new Map();
	protected databases: Map<string, IDatabaseDriver> = new Map();
	protected custom: Map<string, any> = new Map();
	protected default = '';

	/**
	 * Creates an instance of the database class which contains and
	 * controls the management of the database, this class can be extended
	 * to add additional functionality.
	 * 
	 * @param options The framework options.
	 */
	public constructor(protected options: IOptions, protected logger: Logger) {}

	/**
	 * This method will initialise and import any required drivers and then
	 * prepare the drivers to be used.
	 * 
	 * @returns void
	 */
	public async initialise(): Promise<void> {
		if (!this.options.database) return;

		// Setup the drivers and import the classes.
		for (const index in this.options.databases) {
			const databaseConfig = this.options.databases[index];
			if (this.drivers.has(databaseConfig.driver)) continue;
			if (!databaseConfig.customDriver) {
				const basepath = resolve(__dirname, '../driver');
				const filepath = resolve(basepath, `database-${databaseConfig.driver}.${String(process.env.ENV === 'dev' ? 'ts' : 'js')}`);
				const databaseModule = await import(filepath);
				const className = Object.keys(databaseModule)[0];
				this.drivers.set(databaseConfig.driver, databaseModule[className]);
			} else {
				this.drivers.set(databaseConfig.driver, this.custom.get(databaseConfig.driver));
			}
		}

		// Now let's create instances of the drivers.
		this.options.databases?.forEach((databaseConfig: IDatabaseItem) => {
			if (!this.drivers.has(databaseConfig.driver)) throw new Error(`Missing driver for ${databaseConfig.driver}.`);
			const driver = this.drivers.get(databaseConfig.driver);
			this.databases.set(databaseConfig.unique, new driver(databaseConfig));
			if (databaseConfig.default) this.default = databaseConfig.unique;
		});
	}

	/**
	 * This will return an existing database instance based on the given unique
	 * name if it exists.
	 * 
	 * @param unique The unique key.
	 * @returns The database instance.
	 */
	public getDatabase(unique: string | boolean): any {
		if (unique === false) return this.databases.get(this.default);
		if (!this.databases.has(String(unique))) throw new Error(`No database of unique name: ${String(unique)} found.`);
		return this.databases.get(String(unique));
	}

	/**
	 * This method will take a list of drivers (from the framework usually that
	 * were imported) and then initialise them inside of the database module so
	 * they can be called upon via models, etc.
	 * 
	 * @param drivers The array of drivers.
	 */
	public customDrivers(drivers: Array<any>): any {
		drivers.forEach((driver: any) => {
			this.custom.set(driver.name, driver.class);
		});
	}
}
