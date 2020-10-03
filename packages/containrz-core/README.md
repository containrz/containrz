# containrz

`@containrz/core` is a simple and reactive way to store your data, in any type of javascript/typescript application.

## How to use it

In order to use `@containrz/core`, you need to create a class that extends `Container`, provided on the package.

```js
import { Container } from '@containrz/core'

interface User {
  name: string
  email: string
  phoneNumber: string
}

export class UserContainer extends Container<User> {
  public state = {
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

Once you have your container, you can now start sharing its state by accessing it's singleton:

```js
const usersData = getContainer(UserContainer)
```

The way `getContainer` works is: if there's already an instance of `UserContainer`, it'll return that instance. If not, it'll create a new one, that will then be returned everytime `getContainer` is called.

## Act when it metters

In order to detect everytime that the state is changed, you can use the `subscribeListener` function.

```js
const usersData = getContainer(UserContainer)

const unsubscribe = subscribeListener(usersData, () => {
  // do something with the new state!
})

// Whenever the state changes are no longer relevant, just stop listening
unsubscribe()
```

Note that the `subscribeListener` function returns another function for unsubscribing. Call it whenever the state is no longer relevant, or on unmount.

## Clear everything

If at any point you need to clear all your data (commonly due to a user sign out, for instance), you can simply call `clearContainers` function.
This will remove all the containers stored and managed by `@containrz/core`.

### .destroy()

While clearing the containers, a `destroy` function will be called. This is so that you can cleanup any backgroud task you may have running.

```js
export class UserContainer extends Container<User> {
  constructor() {
    super()
    this.interval = setInterval(() => {
      // do things.
    }, 5000)
  }

  destroy = () => {
    clearInterval(this.interval)
  }
}
```

## Other ways to store your state

`containrz` also allows you to use different base `Containers` to store your states in other ways. Read more about it in the subprojects:

- [@containrz/container-local-storage](../containrz-container-local-storage)
- [@containrz/container-indexeddb](../containrz-container-indexeddb)
