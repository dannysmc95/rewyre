# Migrating

This document defines some of the changes around migrating from version 1 to version 2 of the framework.

<br><br>

## Database Definitions.

When you define your framework config we have removed the database fields inside of the main options and moved them a new field called: `databases` and the enable feature is now called: `database`. To enable database access set the `database` field to `true` and then create a `databases` array where each object will define the database's config.

Please note the the `default: true` field, this will make all models fallback to the that specific database config, so if not specific database is defined, it will use the default defined database.

```typescript
import { Framework, Drivers } from 'rewyre';

const application: Framework = new Framework({
	port: 3005,
	database: true,
	databases: [
		{
			unique: 'mongo',
			host: 'localhost',
			port: 27017,
			name: 'rewyre-testing',
			driver: Drivers.MONGO,
			default: true,
		},
	],
});
```

<br><br>

## Config Name Changes (Other).

Various options have been renamed to be simpler to understand, see the table below.

| Old Name | New Name |
| - | - |
| `ws_enable` | `websocket` |
| `ws_path` | `websocket_path` |
| `ws_access` | `websocket_access` |
| `hostname` | `host` |

<br><br>

## Email Functionality Removal.

All email functionality has been fully removed from the package, due to it bloating the framework, the preference is to use providers to provide email support into any required controller using whatever framework you wish to use.