# @containrz/container-indexeddb

## Persist your data

If you'd like to have a persistent state in `indexeddb`, you can do so by having your container extend `IndexedDBContainer`.

The implementation is the same as using the `Container` from [@containrz/core](../containrz-core).

```js
import { IndexedDBContainer } from '@containrz/container-indexeddb'

interface User {
  name: string
  email: string
  phoneNumber: string
}

export class UserContainer extends IndexedDBContainer<User> {
  state = {
    name: '',
    email: '',
    phoneNumber: '',
  }

  public setUser = (user: User) => this.setState(user)

  public setName = (name) => this.setState({ name })

  public setEmail = (email) => this.setState({ email })

  // ...
}
```

## Cleanup remark

Anytime that you use `clearContainers` from [@containrz/core](../containrz-core), the databases created will be all cleared, and the data will, obviously, no longer persist.

If, however, you'd like to manually trigger a deletion of the database for any given container, you can call the `clearDB` method:

```js
export class UserContainer extends IndexedDBContainer<User> {
  // ...

  public cleanup = () => this.clearDB()

  // ...
}
```

## Other ways to store your state

`containrz` also allows you to use different base `Containers` to store your states in other ways. Read more about it in the subprojects:

- [@containrz/core](../containrz-core)
- [@containrz/container-local-storage](../containrz-container-local-storage)
