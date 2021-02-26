# @containrz/react-hook

`@containrz/stencil-decorator` is a simpe decorator to help you manage your global and local states without any need for configuration and no dependency on context.

## How to use it

In order to use `@containrz/stencil-decorator`, you need to create a class that extends `Container`, provided on the package.

```js
import { Container } from '@containrz/stencil-decorator'

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
import { Component, VNode } from '@stencil/core'
import { UseContainer } from '@containrz/stencil-decorator'
import { UserContainer } from './UserContainer'

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  @UseContainer(UserContainer) userData: UserContainer

  render(): VNode {
    return (
      <div>
        <input
          value={this.userData.state.name}
          onChange={e => this.userData.setName(e.target.value)}
        />
        <p>{this.userData.state.name}</p>
      </div>
    )
  }
}
```
