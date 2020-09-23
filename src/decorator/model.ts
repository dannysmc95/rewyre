/**
 * The Model decorator is used to define a class as a model, this injects a MongoDB collection
 * instance based on the model name, the name is also used for the InjectModel decorator and
 * used as a reference from inside a controller with the model available using the following:
 * this.models.<model_name>. The fields definition is a simple object containing a key value
 * object where the key is the name of the field, and the value is the standard JavaScript type.
 * 
 * As well you can make fields optional, by adding a question mark at the start of the value
 * before the type is defined, example: name: '?string', which tells the validator that it is
 * not a required field.
 * 
 * @param name The name of the model, used for injection.
 * @param fields The fields definition.
 * @param isUserModel [Optional] Whether is the core user model, you can only have one.
 */
export function Model(name: string, fields: any, isUserModel?: boolean): any {
	return (target: any): void => {
		if (typeof isUserModel !== 'undefined' && isUserModel === true) {

			// Define required fields for user model.
			const requiredFields: Array<any> = [
				{ name: 'username', type: 'string', exists: false },
				{ name: 'password', type: 'string', exists: false },
				{ name: 'role', type: 'string', exists: false },
				{ name: 'auth_token', type: 'string', exists: false },
			];

			// Attempt to match the given fields with the required ones.
			for (const index in requiredFields) {
				for (const field_name in fields) {
					if (field_name === requiredFields[index].name) {
						requiredFields[index].exists = true;
					}
				}
			}

			// Check for any missing fields.
			const missingFields: Array<string> = requiredFields.filter((field: any) => { return field.exists === false; }).map((field: any) => { return field.name});

			// Now throw an error if there are missing fields.
			if (missingFields.length > 0) {
				throw new Error(`The core user model must contain the following fields: ${missingFields.join(', ')}, please read the documentation on how to add these.`);
			}
		}

		// Assign the model controller a meta object.
		Reflect.defineMetadata('model', {
			collection: name,
			className: target.name,
			fields: fields,
			isUserModel: (typeof isUserModel === 'undefined' ? false : isUserModel),
		}, target);
	}
}