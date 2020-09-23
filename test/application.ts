import { Framework } from '../src/index';
import { HomeController } from './controller/home';

(async() => {

	// Create an instance of the framework.
	const application: Framework = new Framework({});

	// Register classes.
	application.register([ HomeController ]);

	// Start the server.
	await application.start();

})();