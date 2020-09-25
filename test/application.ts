import { Framework } from '../src/index';
import { HomeController } from './controller/home';
import { ApiController } from './controller/api';
import { TasksModel } from './model/tasks';

(async() => {

	// Create an instance of the framework.
	const application: Framework = new Framework({
		db_database: 'todo-manager-demo',
	});

	// Register classes.
	application.register([ HomeController, ApiController, TasksModel ]);

	// Start the server.
	await application.start();

})();