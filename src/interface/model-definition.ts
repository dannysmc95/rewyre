export interface IModelDefinition {
	collection: string;
	className: string;
	fields: Array<IModelFieldDefinition>;
}

interface IModelFieldDefinition {
	[key: string]: string;
}