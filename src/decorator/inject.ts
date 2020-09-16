import { IReturn } from '../interface/return';

export function Inject(name: string): any {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor): void => {
		const originalFunction: any = descriptor.value;
		descriptor.value = async function(...args: any[]): Promise<IReturn> {
			if (typeof this[name] === 'undefined') {
				this[name] = (global as any).services[name];
			}
			return await originalFunction.apply(this, args);
		}
	}
}