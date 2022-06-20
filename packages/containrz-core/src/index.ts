import { BehaviorSubject } from 'rxjs'
import { Class } from 'utility-types'

export interface ContainerType<T = any> {
  setState: (updater: Partial<T> | ((prevState: T) => Partial<T> | null)) => void
  state: T
  destroy: () => void
  __destroyInternalCleanup?: () => void
}

export const isInstanceOfContainer = <C extends ContainerType>(container: C | Class<C>): boolean =>
  (container as ContainerType).setState !== undefined &&
  (container as ContainerType).state !== undefined

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

export const subscribeListener = <T>(
  container: ContainerType<T>,
  listener: (_: { nextState: T; oldState: T }) => void,
  deleteOnUnsubscribe?: boolean,
) => {
  const emitter = getEmitter(container)
  const sub = emitter.subscribe(listener)

  return () => {
    sub.unsubscribe()

    if (deleteOnUnsubscribe) {
      deleteContainer(container)
    }
  }
}

export const deleteContainer = <C extends ContainerType>(container: C | Class<C>) => {
  const c = getContainer(container)

  Array.from(containersMap.keys()).forEach(key => {
    const cnt = getContainer(key)

    if (cnt === c) {
      containersMap.delete(key)
    }
  })

  emittersMap.delete(c)

  c.destroy()
  c.__destroyInternalCleanup && c.__destroyInternalCleanup()
}

export const getContainer = <C extends ContainerType>(container: C | Class<C>): C =>
  isInstanceOfContainer(container) ? (container as C) : (findContainer(container as Class<C>) as C)

export class Container<State = any> {
  private animationFrame: number
  public state!: State

  private __internal__updateState = (nextState: any, oldState: any) => () => {
    getEmitter(this).next({ nextState, oldState })

    this.animationFrame = undefined
  }

  public setState = (updater: Partial<State> | ((prevState: State) => Partial<State> | null)) => {
    const nextState = updater instanceof Function ? updater(this.state) : updater
    if (nextState) {
      const oldState = this.state
      this.state =
        nextState instanceof Object ? Object.assign({}, this.state, nextState) : nextState

      if (window?.requestAnimationFrame) {
        if (this.animationFrame) {
          window.cancelAnimationFrame(this.animationFrame)
        }

        this.animationFrame = window.requestAnimationFrame(
          this.__internal__updateState(this.state, oldState),
        )
      } else {
        this.__internal__updateState(this.state, oldState)
      }
    }
  }

  public destroy = () => {}
}
