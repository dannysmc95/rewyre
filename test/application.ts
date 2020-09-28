import { Framework } from '../src/index';
import { HomeController } from './controller/home';
import { ApiController } from './controller/api';
import { TasksModel } from './model/tasks';
import { TaskService } from './service/task';
import { MiscProvider } from './provider/misc';

(async() => {

	// Create an instance of the framework.
	const application: Framework = new Framework({
		db_database: 'todo-manager-demo',
		ws_enable: true,
	});

	// Register classes.
	application.register([ HomeController, ApiController, TasksModel, TaskService, MiscProvider ]);

	// Start the server.
	await application.start();

})();