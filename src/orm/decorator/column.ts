/**
 * The entity decorator is used for for creating entities, this will
 * define the given class as an entity and then register it with the
 * ORM module.
 * 
 * @module ORM
 * @returns Function
 */
export function Column(options: any): any {
	return function(target: Record<string, any>, propertyKey: string) {

		// Define the base value.
		let value: string;

		// Define the getter.
		const getter = function() {
			return value;
		}

		// Define the setter.
		const setter = function(newValue: any) {
			value = newValue;
		}

		// Define the getter and setters.
		Object.defineProperty(target, propertyKey, {
			get: getter,
			set: setter,
		});

		// Check for empty properties, if they are undefined, define them.
		if (!Reflect.hasMetadata('properties', target.constructor)) {
			Reflect.defineMetadata('properties', [], target.constructor);
		}

		// Define the existing properties.
		const propertyType = Reflect.getMetadata("design:type", target, propertyKey);
		const properties: Array<any> = Reflect.getMetadata('properties', target.constructor);

		// Create a new route for this method.
		properties.push({
			is_primary: false,
			name: propertyKey,
			type: propertyType.name,
			options: options,
		});

		// Re-assign the route meta.
		Reflect.defineMetadata('properties', properties, target.constructor);
	}
}
