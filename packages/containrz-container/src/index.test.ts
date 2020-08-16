import { Container } from '.'

interface ObjectContainerState {
  name: string
  age: number
  items: Array<string>
}

const defaultState = {
  name: '',
  age: 0,
  items: [] as string[],
}

class ObjectContainer extends Container<ObjectContainerState> {
  public state = defaultState

  public setName = (name: string) => this.setState({ name })

  public setAge = (age: number) => this.setState({ age })

  public addItem = (item: string) => this.setState(s => ({ items: [...s.items, item] }))
}

const next = jest.fn()

jest.mock('@containrz/core', () => ({
  getEmitter: (v: any) => ({
    next,
  }),
}))

describe('Test `Container` class', () => {
  it('Should create container with default state', () => {
    const container = new ObjectContainer()

    expect(container.state).toEqual(defaultState)
  })

  it('Should set container state values', () => {
    const container = new ObjectContainer()

    const newAge = 25
    container.setAge(25)

    expect(next).toBeCalledTimes(1)
    expect(container.state.age).toEqual(newAge)

    next.mockClear()

    const newName = 'Nic'
    container.setName(newName)

    expect(next).toBeCalledTimes(1)
    expect(container.state.name).toEqual(newName)

    next.mockClear()

    const newItem = 'A new item'
    container.addItem(newItem)

    expect(next).toBeCalledTimes(1)
    expect(container.state.items).toEqual([newItem])
  })
})
