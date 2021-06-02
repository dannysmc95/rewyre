<p align="center">
	<a href="#">
		<img width="300" src="https://github.com/dannysmc95/rewyre/blob/master/rewyre-logo.svg">
	</a>
</p>

<p align="center">
	Rewyre is a fast and flexible wiring tool for developing RESTful and WebSocket APIs using TypeScript decorators.
</p>

<p align="center">
	<img src="https://img.shields.io/npm/v/rewyre?color=blue">
	<img src="https://img.shields.io/npm/l/rewyre">
	<img src="https://img.shields.io/npm/dw/rewyre">
</p>

The rewyre framework is built on top of express, and express-ws and utilises TypeScript and decorators to give you a powerful wiring tool to create API applications in a very short time with built-in support for MySQL/MongoDB for models.


<br />


## Important Changes

> See the docs/migrating/v1-v2.md for more information regarding the move to V2.

> The framework's version 2 release is now licensed under MIT.


<br />


## Installation

You can install from NPM with:

```plaintext
npm install --save rewyre
```


<br />


## Getting Started

Below is a simple example showing a database connection and a simple find, for a more in-depth example, have a look at the `test` folder in the source, which has a simple to-do demo.

**Note**: _The expectation is that this framework is to be used with TypeScript specifically and that you would you use your own tooling for building and compiling it, of course, you can use JavaScript and babel instead, but it is suggested to use TypeScript, for help with setting up, look at the tsconfig.json file inside of the test folder._

```typescript
// Import the parts we need.
import { Framework, Drivers, Controller, Route, IReturn, Model, AbstractModel, AbstractController } from 'rewyre';


// Define our controller.
@Controller('/', 'home')
class HomeController extends AbstractController {

	@Route('GET', '/')
	public async index(): Promise<IReturn> {
		const users = this.users.find({});
		return { status: 200, content: users };
	}
}


// Define our model.
@Model('users', 'general', {
	username: 'string',
	password: 'string',
	blocked: 'boolean',
	block_reason: '?string',
})
class UsersModel extends AbstractModel {}


// Create an isolated async function.
(async() => {

	// Create an instance of the framework.
	const application: Framework = new Framework({
		port: 3005,
		database: true,
		databases: [
			{
				unique: 'primary',
				host: 'localhost',
				port: '27017',
				name: 'example-app',
				driver: Drivers.MONGO,
				default: true,
			},
		],
	});

	// Register classes.
	application.register([
		HomeController,
		UsersModel,
	]);

	// Start the server.
	await application.start();
})();


```


<br />


## Available Features

The below lists the features and their stable state, this framework's API will not change for the forseable future, any changes will be fully implemented and any non-backwards compatible changes will be in the latest major version, following the semver versioning scheme.

| Feature | Description | Status |
| - | - | - |
| HTTP Server | The HTTP server is the base for the framework and is built on top of Express. | `Stable` |
| WebSocket Server | The WebSocket server uses `express-ws` package to apply WebSocket support. | `Stable` |
| Middleware Support | Standard Express middleware is supported using the `useMiddleware` method. | `Stable` |
| Static Assets | Standard Express static is supported as well using the `useStatic` method. | `Stable` |
| Controllers | Controller classes and the `@Controller` decorator are both implemented. | `Stable` |
| Controller Routes | Controller routes are and the `@Route` decorator are both implemented. | `Stable` |
| Models | Model classes and the `@Model` decorator are both implemented. | `Stable` |
| Drivers | Database drivers allow you to use one of the many implemented into the framework. | `Stable` |
| Custom Drivers | Define your own database drivers to implement other databases into your framework. | `Stable` |
| Framework Hooks | Allows you to hook functions into internal events. | `Beta` |
| Plugin Support | See documentation but plugins are now implemented to allow you to package code pieces into reusable and shareable components. | `Beta` |
| Multiple Databases | Your models can use any database, including multiple, have data in many databases? Write a model around a specific database instead or just fallback to the default. |
| Injections | Injections are done using a single `@Inject` decorator and you can inject one or many, you can inject models and providers to any service or controller as required. | `Stable` |
| Services | Service classes and the `@Service` decorator are both implemented and services can run on a loop based on seconds. | `Stable` |
| Providers | Providers and the `@Provide` decorator are both implemented, the provider allows you to create built in helper classes that can be injected to controllers, and services. | `Stable` |


<br />


## Upcoming Features

Upcoming features that are planned, some features may come out quicker due to technical requirements.

* **Authentication Decorator** - To implement an authentication decorator for out-of-the-box permissions.
* **Threaded Decorator** - To add support for controllers being run in a different thread, for long processes.
* **Plugin Support** - There is a plan to add plugin support, but I am not sure what this will look like yet.
* ~~**Multiple Databases** - Support for using multiple databases using database drivers alongside your own.~~
* **ORM** - To implement a clean ORM solution using the built in functionality and utilising decorators.
* **ORM Validation** - To implement ORM validation decorators to support automatic validation and serialisation.


<br />


## Future Plans

The future for this library is big, I have many plans to add lots of new features and more decorators to add additional features, and I plan to turn this (slowly) into a full out-of-the-box TypeScript based framework for building Node.JS server side applications. This framework will be able to handle any structure and can be included into other applications like Vue.JS Server-Side Rendering alongside using it render HTML based applications instead of only API based.