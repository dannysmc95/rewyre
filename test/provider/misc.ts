import { Provide, AbstractProvider, Logger } from '../../src/index';

@Provide('misc')
export class MiscProvider extends AbstractProvider {

	protected logger: Logger;

	constructor() {
		super();
		this.logger = new Logger();
	}

	public getLogger(): Logger {
		return this.logger;
	}
}