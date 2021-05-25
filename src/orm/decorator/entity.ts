/**
 * The entity decorator is used for for creating entities, this will
 * define the given class as an entity and then register it with the
 * ORM module.
 * 
 * @module ORM
 * @returns Function
 */
export function Entity(): any {
	return (target: any) => {

		// Define base class information.
		Reflect.defineMetadata('class_type', 'entity', target);
		if (!Reflect.hasMetadata('properties', target)) Reflect.defineMetadata('properties', [], target);
	};
}
