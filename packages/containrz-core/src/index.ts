import { isInstanceOfContainer, ContainerType } from '@containrz/types'
import { BehaviorSubject } from 'rxjs'
import { Class } from 'utility-types'

export const emittersMap = new Map<ContainerType<any>, BehaviorSubject<any>>()

export const getEmitter = (container: ContainerType<any>): BehaviorSubject<any> => {
  if (!emittersMap.has(container)) {
    const emitter = new BehaviorSubject(container)
    emittersMap.set(container, emitter)
    return emitter
  }

  return emittersMap.get(container)!
}

export const containersMap = new Map<Class<ContainerType<any>>, ContainerType<any>>()

export const findContainer = <C>(c: Class<ContainerType<any>>): ContainerType<C> => {
  if (!containersMap.has(c)) containersMap.set(c, new c())

  return containersMap.get(c)!
}

export const clearContainers = () => {
  Array.from(containersMap.keys()).map(key => {
    const container = getContainer(key)
    container.destroy()
  })

  containersMap.clear()
  emittersMap.clear()
}

export const subscribeListener = (
  container: ContainerType<any>,
  listener: () => void,
  deleteOnUnmount?: boolean
) => {
  const emitter = getEmitter(container)
  const sub = emitter.subscribe(listener)

  return () => {
    sub.unsubscribe()

    if (deleteOnUnmount) {
      emittersMap.delete(container)
    }
  }
}

export function getContainer<C extends ContainerType>(container: C | Class<C>): C {
  return isInstanceOfContainer(container)
    ? (container as C)
    : (findContainer(container as Class<C>) as C)
}
