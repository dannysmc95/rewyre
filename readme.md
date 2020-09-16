# Rewyre Framework

> A fast and flexible REST API wiring framework built using TypeScript decorators.

The Rewyre framework is a simplistic RESTful API framework built on top of Express, and TypeScript, you will need to use TypeScript to utilise the functionality. The framework is built around my immediate issue and was for prototyping applications with very little resistance as the framework provides a series of decorators and a server. Another note to make is that the application passes all paths directly to express so using path params is supported, example: `/user/:user_id`, I shall create a proper example when I get some time.

_**NOTE**: Please note this framework is for my own learning and is heavily based around my personal coding style, if you have better ideas of how something could be done better, then please, let me know so I can update it or add new ideas._

**NOTE**: The package used to be called Aether Framework, but after we found a better name for it, so please use this from now on, as you can see we also have started from version 0.1.0, this includes all updates from the previous aether-framework@0.2.7 so nothing is lost.

---

## Availabe Boilerplates

The `rewyre-vue` project has now been created to support rewyre as a backend platform with the Vue 3 frontend, [Visit it here](https://github.com/dannysmc95/rewyre-vue).

---

## Installation

To install, you can install from NPM with:

```plaintext
npm install --save rewyre
```

---

## Features

### Implemented

Below lists features that are currently implemented.

| Feature | Description | Release Type |
| - | - | - |
| Web Server | The implementation is a standard Express HTTP server. | `Beta` |
| Middleware | This relates to implementing a function for applying Express middleware functions. | `Beta` |
| Controller Decorator | This decorator implements a prefixed path for all child methods. | `Beta` |
| Route Decorator | Defines the HTTP method and the path (after the prefix) for that method. | `Beta` |
| Inject Decorator | The inject method will allow you to inject provided classes, these can be helpers etc. | `Alpha (May Change)` |
| Provide Decorator | The provide decorator will allow other methods to inject and resolve the provided class. | `Alpha (May Change)` |
| Model Decorator | The model decorator allows you to define a class as a model and use the built in ORM to map data. | `Beta` |
| InjectModel Decorator | This decorator will allow you to inject one or many models into a controller. | `Beta` |

---

### Future Features

Below lists features that will be implemented in time.

| Feature | Description |
| - | - |
| Threaded Decorator | Defines whether a method should be called in a separate thread because it may be CPU intensive and could slow the application. |
| Authenticated Decorator | The decorator defines that a user should be authenticated, passing an optional role, will check against that user's role. |
| WebSocket Support | The plan is to implement WebSocket decorators for creating and managing a WebSocket, thinking something like `@WebSocket('/websocket')`. |
| Plugin Support | The ability to expand functionality using plugins, this is later on, but being able to add plugins to add or change functionality. |

---

## Full Example

Visit here for a full example you can download.

[https://github.com/dannysmc95/rewyre](https://github.com/dannysmc95/rewyre)

---

## Getting Started

Below is our quick start example.

```typescript
// Import the parts of the package we need.
import { Server, Controller, Route, IReturn, IContext, IResult, Model, InjectModel } from 'rewyre';

// Create async function.
(async () => {

	// Let's create an instance of the server running on port 8080.
	const application: Server = new Server({ port: 8080 });

	// General event hook to init any and all functionality.
	await application.init();

	// Create your first model.
	@Model('users', {
		name: '?string',
		username: 'string',
		password: 'string',
		token: '?string',
	})
	class UsersModel extends AbstractModel {

		public async login(username: string, password: string): Promise<string | null> {
			const result: IResult | null = await this.findOne({username: username, password: password});
			return result;
		}
	}

	// Create your first controller.
	@Controller('/test')
	@InjectModel('users')
	class TestController {

		@Route('GET', '/hello')
		public async index(context: IContext): Promise<IReturn> {
			return { status: 200, content: 'Hello, World!' };
		}

		@Route('POST', '/login')
		public async login(context: IContext): Promise<IReturn> {
			const username: string = String(context.body.username);
			const password: string = String(context.body.password);
			const result: IRecord | null = await this.models.users.login(username, password);
			if (result === null) {
				return { status: 500, content: 'Wrong credentials' };
			} else {
				return { status: 200, content: result };
			}
		}
	}

	// Define a static folder.
	application.registerStatic('/assets', path.resolve(__dirname, '/public'));

	// Then we register the models.
	application.registerModels([ UsersModel ]);

	// Next we register the controllers.
	application.registerControllers([ TestController ]);

	// Then we start the application server.
	application.start();
})();
```

---

## Middleware

If you want to use any kind of express based middleware then the functionality is the exact same as normal, to do it do the following:

```typescript
application.registerMiddleware((request: any, response: any, next: any): void => {
	// Do something here.
	next();
});
```

---

## Decorators

### @Controller(path: string)

The controller decorator is used to define a controller and will use the path to generate a _prefix_ path for all routes inside.

> In recent changes you must extend the abstract controller class, for support with models.

```typescript
import { Controller, AbstractController } from 'rewyre';

@Controller('/test')
class TestController extends AbstractController {
	// Methods will be added here.
}
```

The above defines that all child routes will be prefixed with /test.

---

### @Route(method: string, path: string)

The route method defines a route around a controller method, the method parameter is either the HTTP method: POST, GET, PUT, etc. The path parameter is the last part of the path (after the prefix) to that method.

> All routes are proxied directly to express, therefore using dynamic paths like `/user/:user_id` will work, you can use context.params to get the parameters.

```typescript
import { Controller, Route, IReturn, IContext, AbstractController } from 'rewyre';

@Controller('/test')
class TestController extends AbstractController {

	@Route('GET', '/foo')
	public async foo(context: IContext): Promise<IReturn> {
		// Method logic will go here.
	}
}
```

So if we say that our server is running on port 8080, then the path to that method would be: `http://localhost:8080/test/foo`.

---

### @Model(name: string, fields: Object)

The model decorator will allow you to build your own data objects, by default, we use the MongoDB database engine, and all types are just standard JavaScript types, therefore when defining a model, but please note, validation is ONLY done on insert, but you can call the validate function. To define a model you must create a class that extends the abstract model class which has a series of built in defaults, but you can extend it with your own functions you can call in the controllers.

The validate function which can be called inside of the controller as `this.models.<model_name>.validate(record);` or can be called inside of the model as `this.validate(record);` is synchronous and will validate the record properties against the defined model, and will return an object with `valid: boolean` and `reason?: string` if there is a reason.

> Additionally if you want a parameter to be optional then you just need to put ? in front of the type, see example.

The model is instantiated and given to a controller once injected with the collection automatically assigned to the model as `this.collection` so you can call methods from this.

```typescript
import { Model, AbstractModel } from 'rewyre';

@Model('users', {
	id: 'id',
	username: 'string',
	password: 'string',
	optional_value: '?number',
})
class UserModel extends AbstractModel {

	public async checkUserExists(id: string): Promise<boolean> {
		const result: IRecord | null = await this.findOne({id: id});
		if (result !== null) {
			return true;
		} else {
			return false;
		}
	}
}
```

---

### @InjectModel(modelName: string)

The above decorator should be applied to controllers, and will instatiate models and assign the database collection to the model, once this is done the model becomes available in the controllers `this.models.<modelName>` property from within the controller.

```typescript
import { Controller, Route, IContext, IReturn, InjectModel, IValidateResponse, AbstractController } from 'rewyre';

@Controller('/user')
@InjectModel('users')
export class UserController extends AbstractController {

	@Route('GET', '/test')
	public async test(context: IContext): Promise<IReturn> {
		const response: IValidateResponse = await this.models.users.validate({
			name: 'John Doe',
			username: 'johndoe123',
			password: 'PretendUser123',
		}));
		return { status: 200, content: response };
	}
}
```

---

### @Provide(uniqueName: string)

The provide decorator will accept a unique name for the class you wish to provide and then save it ready for it to be called from any other application. Use the Inject decorator to inject a provided class into an application.

```typescript
import { Provide } from 'rewyre';

@Provide('test_helper')
class TestHelper {

	public function say(message: string): void {
		console.log(message);
	}
}
```

---

### @Inject(uniqueName: string | string[])

Once a class is provided using the decorator, then you can use the Inject decorator to inject into a class, now when using inject, you use it against a method, but will enable it for all methods inside, this is a bug I am trying to figure out, and is my own take on it.

```typescript
import { Controller, Route, IReturn, IContext, Inject, Provide, AbstractController } from 'rewyre';

@Provide('test_helper')
class TestHelper {

	public function say(message: string): void {
		console.log(message);
	}
}

@Controller('/test')
class TestController extends AbstractController {

	@Route('GET', '/foo')
	@Inject('test_helper')
	public async foo(context: IContext): Promise<IReturn> {
		// Method logic will go here.
	}
}
```
