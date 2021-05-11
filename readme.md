# Rewyre Framework

## Introduction

The rewyre framework is built on top of express, and express-ws and utilises TypeScript to give you a powerful wiring tool to create API applications in a very short time. The framework uses TypeScript decorators to apply controller and routing functionality and apply additional controls.

<br />

## Installation

You can install from NPM with:

```plaintext
npm install --save rewyre
```

<br />

## Examples

Below are some demos and examples you can try out to help with your development experience and to use as a base.

### Documentation

The documentation is availabe here: [Documentation](https://github.com/dannysmc95/rewyre/wiki).

> NOTE: The `rewyre-vue` project has not been updated to the latest rewyre stable release, but I plan to update that in the coming months, or you are welcome to create some pull requests instead.

### Examples & Demos

Depending on what you want to get out of it, you can look at the [demo](https://github.com/dannysmc95/rewyre/tree/master/test) for a full to-do demo, if you plan to use this for a larger application then there is a boilerplate I have created called: [rewyre-vue](https://github.com/dannysmc95/rewyre-vue) from which the whole project has been created to support Vue 3 + Rewyre + TypeScript, You can check it out [here](https://github.com/dannysmc95/rewyre-vue).

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
| Injections | Injections are done using a single `@Inject` decorator and you can inject one or many, you can inject models and providers to any service or controller as required. | `Stable` |
| Services | Service classes and the `@Service` decorator are both implemented and services can run on a loop based on seconds. | `Stable` |
| Providers | Providers and the `@Provide` decorator are both implemented, the provider allows you to create built in helper classes that can be injected to controllers, and services. | `Stable` |

<br />

## Upcoming Features

There is _some_ functionality left to implement including:

* **Authentication Decorator** - To implement an authentication decorator for out-of-the-box permissions.
* **Threaded Decorator** - To add support for controllers being run in a different thread, to long processes.
* **Plugin Support** - There is a plan to add plugin support, but I am not sure what this will look like yet.

<br />

## Future Plans

The future for this library is big, I have many plans to add lots of new features and more decorators to add additional features, and I plan to turn this (slowly) into a full out-of-the-box TypeScript based framework for building Node.JS server side applications. This framework can handle any structure and can be included into other applications like Vue.JS Server-Side Rendering. You can use this framework for API first structure or even to use it to build a basic website, using Express routing.

<br />

## Development Overview

While I additionally add new functionality they will go through various states, they will be developed in the `develop` branch and new features will be labelled `alpha` until everything has been finalised, then moved to `beta` status while I test for bugs, and then `stable` once the API won't change and I have removed any bugs I can find, of course if you find a bug then please, create an issue!