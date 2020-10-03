# @containrz/container-local-storage

## Persist your data

If you'd like to have a persistent state in your `localStorage`, you can do so by having your container extend `LocalStorageContainer`.

When extending `LocalStorageContainer`, there's a small requirement you need to follow: you need to have a `constructor` method in your container, that calls `super()` with the initial state. Here's how your state would look like with `LocalStorageContainer`:

```js
import { LocalStorageContainer } from '@containrz/container-local-storage'

interface User {
  name: string
  email: string
  phoneNumber: string
}

export class UserContainer extends LocalStorageContainer<User> {
  constructor() {
    super({
      name: '',
      email: '',
      phoneNumber: '',
    })
  }

  public setUser = (user: User) => this.setState(user)

  public setName = (name) => this.setState({ name })

  public setEmail = (email) => this.setState({ email })

  // ...
}
```

The `constructor` is necessary so that the initial state can use the stored data and have the default values as fallbacks.
