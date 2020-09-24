import { Framework } from '../src/index';

import { HomeController } from './controller/home';
import { PeopleModel } from './model/people';

(async() => {

	// Create an instance of the framework.
	const application: Framework = new Framework({});

	// Register classes.
	application.register([ HomeController, PeopleModel ]);

	// Start the server.
	await application.start();

})();