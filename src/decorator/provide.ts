export function Provide(name: string): any {
	return (target: any): void => {
		(global as any).services[name] = new target();
	}
}