import { Provide, AbstractProvider } from '../../src/index';

@Provide('test', 'shared')
export class TestProvider extends AbstractProvider {

	public test(): void {
		console.log('TestProvider::test was called!');
	}
}