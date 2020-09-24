import { Framework } from '../src/index';

import { HomeController } from './controller/home';
import { PeopleModel } from './model/people';
import { TestProvider } from './provider/test';

(async() => {

	// Create an instance of the framework.
	const application: Framework = new Framework({});

	// Register classes.
	application.register([ HomeController, PeopleModel, TestProvider ]);

	// Start the server.
	await application.start();

})();