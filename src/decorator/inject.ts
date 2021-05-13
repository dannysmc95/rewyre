/**
 * The Inject decorator is used to specifically to inject models into a controller or service,
 * you can supply a string or an array of strings to inject, please make sure to name your
 * injections useful names, once you have added this, you will need to define the injected models
 * or providers as properties inside of your class, see docs for more information.
 * 
 * @param modelNames The name or array of names of models/providers you wish to inject to this class (controller or service).
 * @returns Function
 */
export function Inject(classItems: Array<string> | string): any {
	return (target: any) => {

		// Check for existing models, if not, default to empty array.
		if (!Reflect.hasMetadata('injects', target)) {
			Reflect.defineMetadata('injects', [], target);
		}

		// Define the models array from metadata.
		const models: Array<any> = Reflect.getMetadata('injects', target);

		// If model name is string, add it like so, otherwise spread the array as parameters.
		if (typeof classItems === 'string') {
			models.push(classItems);
		} else {
			models.push(...classItems);
		}

		// Re-assign the models array back to meta.
		Reflect.defineMetadata('injects', models, target);
	}
}