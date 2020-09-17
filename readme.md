# Rewyre Framework

## Introduction

The rewyre framework is a REST-based framework built on top of express, and express-ws and utilises TypeScript to give you a powerful wiring tool to create API applications in a very short time. The framework uses TypeScript decorators to apply controller and routing functionality and apply additional controls.

The package was originally called `aether-framework` and then changed to `@rewyre/core` and is now just named as `rewyre`, I apologise for this, I was very conflicted with what to name it.



## Installation

You can install from NPM with:

```plaintext
npm install --save rewyre
```



## Examples

Depending on what you want to get out of it, you can look at the [demo](https://github.com/dannysmc95/rewyre/tree/master/test) for a full example, if you plan to use this for a larger application then there is a boilerplate I have created called: [rewyre-vue](https://github.com/dannysmc95/rewyre-vue) from which the whole project has been created to support Vue 3 + Rewyre + TypeScript, You can check it out [here](https://github.com/dannysmc95/rewyre-vue).



## Features

The below table lists all included features, please note the status of each feature, during the course of developing this, the API may change many times, including breaking changes.

* **HTTP Server** - We use express as the backbone HTTP server.
* **WS Server** - We have opted to use `express-ws` for the WebSocket server.
* **Middleware Support** - All standard middleware for express is supported normally, see [demo](https://github.com/dannysmc95/rewyre/tree/master/test).
* **Static Assets** - You can still define static assets via express, see [demo](https://github.com/dannysmc95/rewyre/tree/master/test).
* **Controller Decorator** - Used to create base routes for HTTP and namespaces for WS.
* **Route Decorator** - The route decorator is applied to methods to give routes and WS access to a method.
* **Model Decorator** - Used to create models which automatically map to the Mongo database.
* **InjectModel Decorator** - Used to add models to specific controllers, to limit what controllers can access.
* **Authenticated Decorator** - Used to authenticate users either via just being logged in or by roles.

There _is some_ functionality left to implement including:

* **Threaded Decorator** - To add support for controllers being run in a different thread, to long processes.
* **Service Decorator** - A service is a process that runs on a schedule and can be programmed to do anything.
* **Plugin Support** - There is a plan to add plugin support, but I am not sure what this will look like yet.

## Future Plans

The future for this library is big, I have many plans to add lots of new features and more decorators to add additional support, originally the provide/inject methods existed on this project, but I have had to remove them because they caused to many issues, these may be re-added, but at the moment, I can't see a reason to use that instead of simply importing a helper.