import { ComponentInterface } from '@stencil/core'
import { Class } from 'utility-types'
import {
  subscribeListener,
  findContainer,
  ContainerType,
  isInstanceOfContainer,
} from '@containrz/core'
import { createStore } from '@stencil/store'

export function UseContainer<C extends ContainerType>(
  container: C | Class<C>,
  deleteOnUnmount?: boolean,
) {
  return (target: ComponentInterface, propertyKey: string): void => {
    const instance = isInstanceOfContainer(container)
      ? (container as C)
      : (findContainer(container as Class<C>) as C)

    const { state, set } = createStore(instance)
    target[propertyKey] = state

    const { connectedCallback, disconnectedCallback } = target

    let unsubscribe

    target.connectedCallback = function() {
      unsubscribe = subscribeListener(
        instance,
        state => {
          if (!isInstanceOfContainer(state)) {
            set('state', state)
          }
        },
        deleteOnUnmount,
      )
      connectedCallback && connectedCallback.call(this)
    }

    target.disconnectedCallback = function() {
      unsubscribe?.()
      disconnectedCallback && disconnectedCallback.call(this)
    }
  }
}

export function registerContainer<C extends ContainerType>(
  container: C | Class<C>,
  target: ComponentInterface,
  deleteOnUnmount?: boolean,
): C {
  const instance = isInstanceOfContainer(container)
    ? (container as C)
    : (findContainer(container as Class<C>) as C)

  const { state, set } = createStore(instance)

  const unsubscribe = subscribeListener(
    instance,
    state => {
      if (!isInstanceOfContainer(state)) {
        set('state', state)
      }
    },
    deleteOnUnmount,
  )

  const { disconnectedCallback } = target

  target.disconnectedCallback = function() {
    unsubscribe?.()
    disconnectedCallback && disconnectedCallback.call(this)
  }

  return state
}

export * from '@containrz/core'
