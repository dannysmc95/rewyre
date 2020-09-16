import { IModelField } from '../interface/model-field';

export function Model(name: string, fields: IModelField, isUserModel?: boolean): any {
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