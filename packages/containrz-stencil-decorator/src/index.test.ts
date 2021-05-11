import { ComponentInterface } from '@stencil/core'
import { Container } from '../../containrz-core/src'
import { UseContainer } from '.'

const defaultState = {
  name: '',
  age: 0,
  items: [] as string[],
}

class ObjectContainer extends Container<{
  name: string
  age: number
  items: Array<string>
}> {
  state = defaultState

  setName = (name: string) => this.setState({ name })

  setAge = (age: number) => this.setState({ age })

  addItem = (item: string) => this.setState(s => ({ items: [...s.items, item] }))
}

describe('UseContainer decorator tests', () => {
  it('renders', async () => {
    const connected = jest.fn()
    const disconnected = jest.fn()

    const target: ComponentInterface = {
      id: '1234',
      connectedCallback: connected,
      disconnectedCallback: disconnected,
    }

    UseContainer(ObjectContainer, true)(target, 'testContainer')

    expect(target.testContainer).toBeDefined()
  })
})
