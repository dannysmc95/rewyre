import { Service, AbstractService, IService } from '../../src/index';

@Service('cron_test', '* * * * *', true)
export class CronTestService extends AbstractService implements IService {

	public async execute(): Promise<void> {
		console.log('Should run every 1 minute.');
	}
}
