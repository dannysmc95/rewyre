import { State } from '../module/state';

/**
 * The abstract class for all controllers to follow,
 * this class defines all the required properties and
 * makes sure the class has access to the required parts
 * of the framework.
 */
export class AbstractController {

	/**
	 * Creates an instance of the AbstractController, should never be
	 * called directly but called from extended classes instead.
	 * 
	 * @param state The state module.
	 */
	constructor(protected state: State) {}
}