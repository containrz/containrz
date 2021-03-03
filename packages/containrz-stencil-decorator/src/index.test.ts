import { ComponentInterface } from '@stencil/core'
import { Container } from '@containrz/core'
import { UseContainer } from '.'

interface ObjectContainerState {
  name: string
  age: number
  items: Array<string>
}

const defaultState: ObjectContainerState = {
  name: '',
  age: 0,
  items: [] as string[],
}

class ObjectContainerLocalStorage extends Container<ObjectContainerState> {
  state = {
    ...defaultState,
  }

  setName = (name: string) => this.setState({ name })

  setAge = (age: number) => this.setState({ age })

  addItem = (item: string) => this.setState(s => ({ items: [...s.items, item] }))
}

const next = jest.fn()

jest.mock('@containrz/core', () => ({
  getEmitter: (v: any) => ({
    next,
  }),
}))

describe('UseContainer decorator tests', () => {
  it('renders', async () => {
    const connected = jest.fn()
    const disconnected = jest.fn()

    const target: ComponentInterface = {
      id: '1234',
      connectedCallback: connected,
      disconnectedCallback: disconnected,
    }

    UseContainer(ObjectContainerLocalStorage, true)(target, 'testContainer')

    expect(target.testContainer).toBeDefined()
  })
})
