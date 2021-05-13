# Rewyre Framework

## Introduction

The rewyre framework is built on top of express, and express-ws and utilises TypeScript and decorators to give you a powerful wiring tool to create API applications in a very short time.

<br /><br />

## Installation

You can install from NPM with:

```plaintext
npm install --save rewyre
```

<br /><br />

## Getting Started

Below is a simple example showing a database connection and a simple find, for a more in-depth example, have a look at the `test` folder in the source, which has a simple to-do demo.

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

<br /><br />

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
| Drivers | Database drivers allow you to use one of the many drivers implemented into the framework. |
| Multiple Databases | Your models can use any database, including multiple, have data in many databases? Write a model around a specific database instead or just fallback to the default. |
| Injections | Injections are done using a single `@Inject` decorator and you can inject one or many, you can inject models and providers to any service or controller as required. | `Stable` |
| Services | Service classes and the `@Service` decorator are both implemented and services can run on a loop based on seconds. | `Stable` |
| Providers | Providers and the `@Provide` decorator are both implemented, the provider allows you to create built in helper classes that can be injected to controllers, and services. | `Stable` |

<br /><br />

## Upcoming Features

There is _some_ functionality left to implement including:

* **Authentication Decorator** - To implement an authentication decorator for out-of-the-box permissions.
* **Threaded Decorator** - To add support for controllers being run in a different thread, to long processes.
* **Plugin Support** - There is a plan to add plugin support, but I am not sure what this will look like yet.

<br /><br />

## Future Plans

The future for this library is big, I have many plans to add lots of new features and more decorators to add additional features, and I plan to turn this (slowly) into a full out-of-the-box TypeScript based framework for building Node.JS server side applications. This framework can handle any structure and can be included into other applications like Vue.JS Server-Side Rendering. You can use this framework for API first structure or even to use it to build a basic website, using Express routing.