# containrz

`containrz` is a simpe hook to help you manage your global and local states without any need for configuration and no dependency on context.

## How to use it

In order to use `containrz`, you need to create a class that extends `Container`, provided on the package.

```js
import { Container } from 'containrz'

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

Once you have your container, you can now start sharing its state:

```js
import * as React from 'react';
import { useContainer } from 'containrz';
import { UserContainer } from './UserContainer';

export const App = () => {
  const user = useContainer(UserContainer);

  React.useEffect(() => {
    fetch('/user')
      .then(response => response.json)
      .then(data => user.setUser(data));
  }, []);

  return <input value={user.state.name} onChange={e => user.setName(e.target.value)} />;
};
```

## Share globally and locally

If your intention is to share the state globally, you can then use simply the reference to the class inside the `useContainer` call. However, you can create local states by creating instances of those classes.

```js
export const App = () => {
  // uses the global state for UserContainer
  const user = useContainer(UserContainer)

  return (
    // ...
  )
}

export const App = () => {
  // creates a local state for UserContainer
  const[localUser] = React.useState(new UserContainer())
  const user = useContainer(localUser)

  return (
    // ...
  )
}

```

If your state should be exclusively local, and you want to make sure it cease to exist after your component unmounts, you can pass a second parameter to the `useContainer` hook, to delete the created container on unmount.

```js
export const App = () => {
  const[localUser] = React.useState(new UserContainer())
  const user = useContainer(localUser, true) // delete container on unmount

  return (
    // ...
  )
}

```

## Clear everything!

If at any point you need to clear all your data (commonly due to a user sign out, for instance), you can simply call `clearContainers` method.
This will remove all the containers stored and managed by `containrz`.

### .destroy()

While clearing the containers, a `destroy` method will be called. This is so that you can cleanup any backgroud task you may have running.

```js
export class UserContainer extends Container<User> {
  // ...
  constructor() {
    this.interval = setInterval(() => {
      // do things.
    }, 5000);
  }

  destroy = () => {
    clearInterval(this.interval);
  };

  // ...
}
```

## Persist your data

If you'd like to have a persistent state, you can do so by having your container extend `LocalStorageContainer`.

When extending `LocalStorageContainer`, there's a small requirement you need to follow: you need to have a `constructor` method in your container, that calls `super()` with the initial state. If we were to reimplement our previous container, here's how it'd look with `LocalStorageContainer`:

```js
import { LocalStorageContainer } from 'containrz'

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
