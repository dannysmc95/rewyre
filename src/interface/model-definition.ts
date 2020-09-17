/**
 * The model definition interface is used to define the required
 * information to generate a model definition that the framework
 * will understand and accept.
 */
export interface IModelDefinition {
	collection: string;
	className: string;
	fields: Array<IModelFieldDefinition>;
}

/**
 * A catch all for all field names and values.
 */
interface IModelFieldDefinition {
	[key: string]: string;
}