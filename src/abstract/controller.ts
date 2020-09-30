import { State } from '../module/state';

/**
 * The abstract class for all controllers to follow,
 * this class defines all the required properties and
 * makes sure the class has access to the required parts
 * of the framework.
 */
export class AbstractController {

	protected state!: State;
}