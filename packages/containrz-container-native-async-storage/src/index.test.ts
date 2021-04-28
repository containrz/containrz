import { NativeLocalStorageContainer } from '.'

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

class ObjectContainerLocalStorage extends NativeLocalStorageContainer<ObjectContainerState> {
  constructor() {
    super(defaultState)
  }

  public setName = (name: string) => this.setState({ name })

  public setAge = (age: number) => this.setState({ age })

  public addItem = (item: string) => this.setState(s => ({ items: [...s.items, item] }))
}

describe('Test `LocalStorageContainer` class', () => {
  it('Should create container with default state', () => {
    const container = new ObjectContainerLocalStorage()

    expect(container.state).toEqual(defaultState)
  })

  it('Should set container state values and store on localStorage', () => {
    // const container = new ObjectContainerLocalStorage()
    // const newAge = 25
    // container.setAge(25)
    // expect(next).toBeCalledTimes(1)
    // expect(container.state.age).toEqual(newAge)
    // expect(localStorage.getItem('ObjectContainerLocalStorage-age')).toBe(JSON.stringify(newAge))
    // next.mockClear()
    // const newName = 'Nic'
    // container.setName(newName)
    // expect(next).toBeCalledTimes(1)
    // expect(container.state.name).toEqual(newName)
    // expect(localStorage.getItem('ObjectContainerLocalStorage-name')).toBe(JSON.stringify(newName))
    // next.mockClear()
    // const newItem = 'Ball'
    // container.addItem(newItem)
    // expect(next).toBeCalledTimes(1)
    // expect(container.state.items).toEqual([newItem])
    // expect(localStorage.getItem('ObjectContainerLocalStorage-items')).toBe(
    //   JSON.stringify([newItem]),
    // )
  })
})
