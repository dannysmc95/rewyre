/**
 * The Model decorator is used to define a class as a model, this injects a MongoDB collection
 * instance based on the model name, the name is also used for the Inject decorator and
 * used as a reference from inside a controller with the model available using the following:
 * this.models.<model_name>. The fields definition is a simple object containing a key value
 * object where the key is the name of the field, and the value is the standard JavaScript type.
 * 
 * As well you can make fields optional, by adding a question mark at the start of the value
 * before the type is defined, example: name: '?string', which tells the validator that it is
 * not a required field.
 * 
 * @param name The name of the model, used for injection.
 * @param type The type of model you are defining, options: general, user.
 * @param fields The fields is an object of key, values defining the model.
 * @param database The database field is false for the default, or the name of the specific database to use.
 * @returns Function
 */
export function Model(name: string, type: 'general' | 'user', fields: any, database: boolean | string = false): any {
	return (target: any): void => {

		// Define base class information.
		Reflect.defineMetadata('class_type', 'model', target);
		Reflect.defineMetadata('name', name, target);
		Reflect.defineMetadata('type', type, target);
		Reflect.defineMetadata('database', database, target);
		Reflect.defineMetadata('fields', fields, target);
	};
}
