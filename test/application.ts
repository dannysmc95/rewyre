import { Framework, CryptoProvider } from '../src/index';
import { HomeController } from './controller/home';
import { ApiController } from './controller/api';
import { TasksModel } from './model/tasks';
import { TaskService } from './service/task';
import { MiscProvider } from './provider/misc';
import { DefaultGuard } from './guard/default';

(async() => {

	// Create an instance of the framework.
	const application: Framework = new Framework({
		db_enable: true,
		db_database: 'todo-manager-demo',
		ws_enable: true,
		port: 3005,
	});

	// Register classes.
	application.register([
		HomeController,
		ApiController,
		TasksModel,
		TaskService,
		MiscProvider,
		CryptoProvider,
		DefaultGuard,
	]);

	// Start the server.
	await application.start();

})();