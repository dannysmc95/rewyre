/**
 * The validate response interface is used to define
 * the expected response from the model's validation
 * process.
 */
export interface IValidateResponse {
	valid: boolean,
	reason?: string,
}