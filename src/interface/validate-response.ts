/**
 * The validate response interface is used to define
 * the expected response from the model's validation
 * process.
 * 
 * @interface IValidateResponse
 */
export interface IValidateResponse {
	valid: boolean,
	reason?: string,
}