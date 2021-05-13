# Rewyre ORM

> This still not finished and although some of the code exists, it is far from alpha stage.

Possible design idea for an ORM.

```typescript
import { ORM } from 'rewyre';

// Create our entity.
@ORM.Entity()
export class User {

	@ORM.Primary({ primary: true, generated: true })
	public _id?: string;

	@ORM.Column({ length: 64 })
	public username: string;

	@ORM.Column({ length: 128 })
	public password: string;

	@ORM.Column({ length: 128 })
	public email: string;

	@ORM.Column()
	public is_blocked: boolean;

	@ORM.Column()
	public activation?: string;

	@ORM.Column()
	public created: string;

	@ORM.Column()
	public updated: string;
}

// Create a manager instance.
const manager = ORM.Manager.get();

// Create a new user entity.
const user = new User();
user.username = 'danny';
user.password = 'danny123';
user.email = 'me@danny.com';
user.is_blocked = false;
user.created = new Date().valueOf();
user.updated = new Date().valueOf();

// Persist and flush the changes to database.
manager.persist(user);
manager.flush();

// Example of getting an array of all users.
const repo = manager.getRepository(User);
const users = repo.find();
```