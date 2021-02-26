import { ComponentInterface, forceUpdate } from '@stencil/core'
import { Class } from 'utility-types'
import {
  subscribeListener,
  findContainer,
  ContainerType,
  isInstanceOfContainer,
} from '@containrz/core'

export function UseContainer<C extends ContainerType>(
  container: C | Class<C>,
  deleteOnUnmount?: boolean,
) {
  return (target: ComponentInterface, propertyKey: string): void => {
    const instance = isInstanceOfContainer(container)
      ? (container as C)
      : (findContainer(container as Class<C>) as C)

    target[propertyKey] = instance

    const { connectedCallback, disconnectedCallback } = target

    let unsubscribe

    target.connectedCallback = function() {
      unsubscribe = subscribeListener(instance, () => forceUpdate(this), deleteOnUnmount)
      connectedCallback && connectedCallback.call(this)
    }

    target.disconnectedCallback = function() {
      unsubscribe?.()
      disconnectedCallback && disconnectedCallback.call(this)
    }
  }
}

export * from '@containrz/core'
