import { getContainer, containersMap, deleteContainer, Container } from '.'

describe('@containrz/core tests', () => {
  beforeEach(() => {
    containersMap.clear()
  })

  it('should create containers on map when getting container', () => {
    class Test extends Container {
      state = {
        test: '',
      }
    }

    getContainer(Test)

    expect(Array.from(containersMap.keys()).length).toBe(1)
  })

  it('should remove container from containersMap when deleting container', () => {
    class Test extends Container {
      state = {
        test: '',
      }
    }
    class Test2 extends Container {
      state = {
        test: '',
      }
    }

    const cont = getContainer(Test)
    getContainer(Test2)

    expect(Array.from(containersMap.keys()).length).toBe(2)

    deleteContainer(cont)

    expect(Array.from(containersMap.keys()).length).toBe(1)
  })
})
