/**
 * This method wraps any method and any caught errors will then be returned
 * to the calling function, makes the code prettier instead of calling try;
 * catch in every function.
 * 
 * Please note you will need to make sure your method will return either the
 * expected return type or an `Error`.
 * 
 * @returns Function
 */
 export function Catch(): any {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor): void => {
		const originalMethod = descriptor.value;
		descriptor.value = function(...args: Array<any>) {
			try {
				return originalMethod.apply(this, args);
			} catch(err) {
				return err;
			}
		};
	};
}