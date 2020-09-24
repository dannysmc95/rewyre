import { IAny } from '../interface/any';

export class Threader {

	public getThread(controller: IAny): any {
		console.log('Create Thread', controller);
		return {};
	}
}