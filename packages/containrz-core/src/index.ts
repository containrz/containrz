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
  Array.from(containersMap.keys()).forEach(key => {
    const container = getContainer(key)
    container.destroy()
    container.__destroyInternalCleanup && container.__destroyInternalCleanup()
  })

  containersMap.clear()
  emittersMap.clear()
}

export const subscribeListener = (
  container: ContainerType<any>,
  listener: () => void,
  deleteOnUnsubscribe?: boolean
) => {
  const emitter = getEmitter(container)
  const sub = emitter.subscribe(listener)

  return () => {
    sub.unsubscribe()

    if (deleteOnUnsubscribe) {
      container.destroy()
      container.__destroyInternalCleanup && container.__destroyInternalCleanup()
      emittersMap.delete(container)
    }
  }
}

export const deleteContainer = <C extends ContainerType>(container: C | Class<C>) => {
  const c = isInstanceOfContainer(container)
    ? (container as C)
    : findContainer(container as Class<C>)

  emittersMap.delete(c)
  c.destroy()
}

export const getContainer = <C extends ContainerType>(container: C | Class<C>): C =>
  isInstanceOfContainer(container) ? (container as C) : (findContainer(container as Class<C>) as C)

export class Container<State = any> {
  public state!: State

  public setState = (updater: Partial<State> | ((prevState: State) => Partial<State> | null)) => {
    const nextState = updater instanceof Function ? updater(this.state) : updater
    if (nextState) {
      this.state =
        nextState instanceof Object ? Object.assign({}, this.state, nextState) : nextState

      getEmitter(this).next(0)
    }
  }

  public destroy = () => {}
}
