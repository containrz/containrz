import { ComponentInterface, forceUpdate } from '@stencil/core'
import { Class } from 'utility-types'
import { subscribeListener, findContainer } from '@containrz/core'
import { ContainerType, isInstanceOfContainer } from '@containrz/types'

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

    target.connectedCallback = function() {
      this['my-subscription'] = subscribeListener(
        instance,
        () => forceUpdate(this),
        deleteOnUnmount,
      )
      connectedCallback && connectedCallback.call(this)
    }

    target.disconnectedCallback = function() {
      this['my-subscription']()
      disconnectedCallback && disconnectedCallback.call(this)
    }
  }
}

export * from '@containrz/core'
export * from '@containrz/types'
