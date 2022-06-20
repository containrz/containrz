import { BehaviorSubject } from 'rxjs'
import { getContainer, containersMap, deleteContainer, Container, getEmitter, emittersMap } from '.'

describe('@containrz/core tests', () => {
  beforeAll(() => {
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: any) => window.setTimeout(cb as () => void, 0))

    jest.useFakeTimers()
  })

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

  it('should only emit changes on following frame', async () => {
    class Test extends Container {
      state = { test: '' }
    }

    const cont = getContainer(Test)

    const subjectMock = new BehaviorSubject(undefined)

    subjectMock.next = jest.fn()

    emittersMap.set(cont, subjectMock)

    cont.setState({ test: 'a' })
    cont.setState({ test: 'b' })

    jest.runAllTimers()

    expect(subjectMock.next).toBeCalledTimes(1)
    expect(subjectMock.next).toHaveBeenCalledWith({
      nextState: { test: 'b' },
      oldState: { test: 'a' },
    })

    cont.setState({ test: 'c' })

    jest.runAllTimers()

    expect(subjectMock.next).toBeCalledTimes(2)
    expect(subjectMock.next).toHaveBeenCalledWith({
      oldState: { test: 'b' },
      nextState: { test: 'c' },
    })
  })
})
