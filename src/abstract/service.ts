import { State } from '../module/state';

/**
 * The abstract class for all services to follow,
 * this class defines all the required properties and
 * makes sure the class has access to the required parts
 * of the framework.
 */
export class AbstractService {

	/**
	 * Creates an instance of the AbstractService, should never be called
	 * directly but called from extended classes instead.
	 * 
	 * @param state The state module.
	 */
	constructor(protected state: State) {}
}