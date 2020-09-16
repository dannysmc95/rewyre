# Introduction

The Rewyre library is an extended, somewhat-opinionated, framework on top of the standard express package. It uses the express server to create available endpoints using decorators and was built using TypeScript. This allows developers to build fast and functional wireframes in minimal time, the application is still not in release and I personally would say as much as it might be safe in production, there is no telling if there are any memory leaks or other issues yet to be found.

The framework is actually built for a backend API I am working on for a new project I am building, this framework will grow and change in time with that application, so as I need features, I shall implement them, although if you also need features like so then please, open an issue and we can discuss, and all PR's are welcome!

---

## Examples

You can find different examples and use cases for the library under `/docs/examples` here you can find many options on how you can go about building your application.

---

## Data Storage

The database utilises the Mongo database engine, but please note, as of yet, there are no controls for adding indexes or other, they would have to be added manually, but in time we will add this.

---

## WebSockets

I plan to implement WebSocket transport that will function on top of the normal controller and route methods, but instead you will add `@Route('WS', '/something')` which will do the same as normal routes, with the prefix. There is also a config option to enable all routes as WebSocket command endpoints, and instead use an ignore decorator for a while controller or just a method to disable WebSocket routing.

---

# Threading

Our threading method uses the ThreadsJS library, and allows a user to define a specific controller as a thread, then all subsequent calls to that controller will be routed to an external thread and executed, this is to help with process intensive 

---