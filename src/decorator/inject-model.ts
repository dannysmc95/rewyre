export function InjectModel(modelNames: Array<string> | string): any {
	return (target: any) => {

		// Check for existing models, if not, default to empty array.
		if (!Reflect.hasMetadata('models', target)) {
			Reflect.defineMetadata('models', [], target);
		}

		// Define the models array from metadata.
		const models: Array<any> = Reflect.getMetadata('models', target);

		// If model name is string, add it like so, otherwise spread the array as parameters.
		if (typeof modelNames === 'string') {
			models.push(modelNames);
		} else {
			models.push(...modelNames);
		}

		// Re-assign the models array back to meta.
		Reflect.defineMetadata('models', models, target);
	}
}