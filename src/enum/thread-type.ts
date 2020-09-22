/**
 * The ThreadType defines which structure you wish to manage
 * threads in your application, the available options are:
 * 
 * ON_DEMAND	= Threads are created when required, this will cost a small overhead of around 80ms.
 * POOLED		= Create a pool of threads for a controller and distribute evenly.
 * SINGLE		= A single thread instance, all requests get added to a queue to be processed.
 * MULTIPLE		= A defined set of threads for a controller, which get work distributed evenly.
 */
export interface ThreadType {
	ON_DEMAND: 'on-demand',
	POOLED: 'pooled',
	SINGLE: 'single-instance',
	MULTIPLE: 'multiple-instances',
}