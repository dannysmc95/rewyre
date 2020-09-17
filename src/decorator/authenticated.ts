import { IContext } from '../interface/context';
import { IReturn } from '../interface/return';

/**
 * The authentication decorator is used to authenticate connections against the core user model
 * which should be created by yourself, the method can be left empty to verify just a logged in
 * state or role/roles can be given to validate against specific roles.
 * 
 * @param roleItems [Optional] A single role, or an array of roles.
 */
export function Authenticated(roleItems?: Array<string> | string): any {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;
		descriptor.value = async function(context: IContext): Promise<IReturn> {

			// Validate the existence of a core user model.
			if (typeof this.coreUserModel === 'undefined') {
				throw new Error('When adding an authenticated decorator, you must create a core user model, please see documentation.');
			}

			// Validate and check the auth token.
			const record: any = await this.models[this.coreUserModel].findOne({auth_token: context.auth_token});
			if (record !== null) {
				context.session.logged_in = true;
				context.session.role = record.role;
				context.session.username = record.username;
				context.session.password = record.password;
			}

			// Define the main variable.
			let shouldContinue = false;

			// Check the user is logged in first.
			if (context.session.logged_in === true) {

				// Check the type of authentication required.
				if (typeof roleItems !== 'undefined') {
					shouldContinue = true;
				} else {
					if (typeof roleItems === 'string') {
						if (context.session.role === roleItems) {
							shouldContinue = true;
						}
					} else if ((roleItems as any) instanceof Array) {
						if ((roleItems as any).indexOf(context.session.role) > -1) {
							shouldContinue = true;
						}
					}
				}
			}

			// Check whether the value is correct, if so call the method, or reject with a 403.
			if (shouldContinue) {
				return await originalMethod.apply(this, [context]);
			} else {
				return { status: 403, content: 'Forbidden' };
			}
		}
	}
}