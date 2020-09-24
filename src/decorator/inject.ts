/**
 * The Inject decorator is used to specifically to inject models into a controller, the core
 * user model is injected to all controllers by default due to the requirement of being able to authenticate
 * connections, but for normal models you can decide which ones are available to specific controllers. The
 * name/names you can use are the ones you define as the first parameter of the model decorator.
 * 
 * @param modelNames The name or array of names of models you wish to inject to this controller.
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