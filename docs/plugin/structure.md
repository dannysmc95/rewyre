# Plugin Structure

The plugin structure should resemble an object of containing classes, each class will then be called as needed.

> Worth noting that plugins **should** use the `rewyre` framework's decorators and that in the context of this framework, a plugin is simply a collection of modules that are pre-built and additionally offer extra hooks.

## Supported Modules (All)

The below is a list of all modules that a plugin can define.

* Controller
* Model
* Guard
* Provider
* Driver
* Service

## Available Hooks

Available hooks are defined below, all hooks will return data related to the hook, for example, on register, the module will be returned, on database, the database instance will be returned, this will all be collected into an object, that will look something like (example for database):

```typescript
{
	state: 'connecting',
	context: DatabaseDriverMongo,
}
```

| Hook Name | Description |
| - | - |
| `onRegister` | Called when a module is registered into the framework, the module object is returned. |
| `onDatabase` | Called when the database state changes, connecting, connected, disconnected, etc. |
| `onInit` | Called when the init process is running, this is called when the framework calls `.start()`. |
| `onStart` | This would be called once the init process is finished and it's about to start. |
|