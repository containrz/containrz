# @containrz/react-hook

`@containrz/react-hook` is a simpe hook to help you manage your global and local states without any need for configuration and no dependency on context.

## How to use it

In order to use `@containrz/react-hook`, you need to create a class that extends `Container`, provided on the package.

```js
import { Container } from '@containrz/react-hook'

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
import * as React from 'react'
import { useContainer } from 'containrz'
import { UserContainer } from './UserContainer'

export const App = () => {
  const user = useContainer(UserContainer)

  React.useEffect(() => {
    fetch('/user')
      .then(response => response.json)
      .then(data => user.setUser(data))
  }, [])

  return <input value={user.state.name} onChange={e => user.setName(e.target.value)} />
}
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

In order to configure the behaviour of your local container instance, you can make use of a configuration object as a second parameter.

```js
export const App = () => {
  const [localUser] = React.useState(new UserContainer())
  const user = useContainer(localUser, {
    // whether or not you want the container to be deleted when component unmounts.
    deleteOnUnmount: true,
    // receive a callback with the new state when there's a change
    onUpdate: (nextState) => {},
    // a function to resolve whether or not the changes to the state should trigger a rerender
    shouldTriggerUpdate: (prevState, nextState) => false,
    // An array of keys of the state object that, when changed, triggers a rerender
    // If it's an empty array, it never rerenders.
    watchKeys: ['name'],
  })

  return (
    // ...
  )
}

```

Note that the options object only acept one option between `shouldTriggerUpdate` and `watchKeys`.

## Other ways to store your state

`containrz` also allows you to use different base `Containers` to store your states in other ways. Read more about it in the subprojects:

- [@containrz/container-local-storage](../containrz-container-local-storage)
- [@containrz/container-indexeddb](../containrz-container-indexeddb)
