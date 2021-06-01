# Example Plugin

To register a plugin you want to use the `.plugin` method from the framework instance, like so:

```typescript
import { Framework } from 'rewyre';
import { MyPlugin } from 'rewyre-my-plugin'; // Or local file, they both will work.

(async () => {

	// Create framework instance.
	const framework = new Framework({});

	// Register the plugin.
	framework.plugin(MyPlugin);

	// Run the framework.
	await framework.start();
})();