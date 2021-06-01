import { Framework, CryptoProvider, Drivers, IContext } from '../src/index';
import { HomeController } from './controller/home';
import { ApiController } from './controller/api';
import { CustomController } from './controller/custom';
import { UserController } from './controller/user';
import { TasksModel } from './model/tasks';
import { TaskService } from './service/task';
import { MiscProvider } from './provider/misc';
import { DefaultGuard } from './guard/default';
import { UsersModel } from './model/users';
import { LogsModel } from './model/logs';
import { DatabaseDriverFile } from './driver/file';

(async () => {

	// Create an instance of the framework.
	const application: Framework = new Framework({
		port: 3005,
		database: true,
		log_levels: ['info', 'warn', 'error', 'verbose', 'debug'],
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

	// Register a HTTP hook (this method will be called on every HTTP request).
	application.registerHook('http', (context: IContext) => {
		console.log(context);
	});


	// Register classes.
	application.register([
		HomeController,
		ApiController,
		CustomController,
		UserController,
		DatabaseDriverFile,
		TasksModel,
		UsersModel,
		TaskService,
		MiscProvider,
		LogsModel,
		CryptoProvider,
		DefaultGuard,
	]);

	// Start the server.
	await application.start();
})();
