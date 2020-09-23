export interface IModelField {
	name: string;
	optional: boolean;
	type: 'string' | 'number' | 'boolean' | 'array' | 'object',
}