import { Framework, CryptoProvider, Drivers } from '../src/index';
import { HomeController } from './controller/home';
import { ApiController } from './controller/api';
import { TasksModel } from './model/tasks';
import { TaskService } from './service/task';
import { MiscProvider } from './provider/misc';
import { DefaultGuard } from './guard/default';
import { UsersModel } from './model/users';
import { DatabaseDriverFile } from './driver/file';

(async() => {

	// Create an instance of the framework.
	const application: Framework = new Framework({
		port: 3005,
		database: true,
		websocket: true,
		websocket_access: 'full',
		databases: [
			{
				unique: 'mongo',
				host: 'localhost',
				port: 27017,
				name: 'rewyre-testing',
				driver: Drivers.MONGO,
				default: true,
			},
			{
				unique: 'mysql',
				host: 'localhost',
				port: 3306,
				user: 'rewyre',
				name: 'rewyre',
				driver: Drivers.MYSQL,
				pass: '!!REWYREFRAMEWORK!!',
			},
			{
				unique: 'file',
				host: 'localhost',
				port: 3306,
				user: 'rewyre',
				name: 'rewyre',
				driver: 'file',	// Define the custom driver engine name.
				pass: '!!REWYREFRAMEWORK!!',
				customDriver: true,
			},
		],
	});

	// Register classes.
	application.register([
		HomeController,
		ApiController,
		DatabaseDriverFile,
		TasksModel,
		UsersModel,
		TaskService,
		MiscProvider,
		CryptoProvider,
		DefaultGuard,
	]);

	// Start the server.
	await application.start();
})();