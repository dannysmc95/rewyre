import { Server } from '../src/index';
import { HomeController } from './controller/home';
import { PeopleController } from './controller/people';
import { PeopleModel } from './model/people';

(async () => {

	// Create server instance.
	const application: Server = new Server({
		database: 'rewyre-core-testing',
		websocket: true,
	});

	// Initialise server functionality.
	await application.init();

	// Register controllers.
	application.registerControllers([ HomeController, PeopleController ]);

	// Register models.
	application.registerModels([ PeopleModel ]);

	// Start server instance.
	await application.start();
})();