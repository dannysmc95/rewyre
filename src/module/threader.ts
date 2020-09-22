import { ThreadType } from '../enum/thread-type';

/**
 * The Threader class is used for creating classes that can be threaded,
 * using the threads.js library: https://github.com/andywer/threads.js/,
 * We create threads which encapsulate a whole controller, allowing requests
 * to be distributed through to a thread instead, the control to define
 * how the thread gets called, so on demand, pooled, or a set amount of
 * instances can all be set from the decorator: @Threaded(). Also noting
 * that you can force a request to not use the thread if required, check the
 * docs for this example.
 */
export class Threader {

	constructor(protected threadType: ThreadType) {}

	/**
	 * Initialises the thead structure for each authenticated controller,
	 * then creates route overrides to be able to take routes from Express,
	 * and move them to the thread instead.
	 */
	public async initialise(): Promise<void> {

	}
}