import { ComponentInterface } from '@stencil/core'
import { Class } from 'utility-types'
import {
  subscribeListener,
  findContainer,
  ContainerType,
  isInstanceOfContainer,
} from '@containrz/core'
import { createStore } from '@stencil/store'

function isClass(obj) {
  const isCtorClass = obj.constructor && obj.constructor.toString().substring(0, 5) === 'class'
  if (obj.prototype === undefined) {
    return isCtorClass
  }
  const isPrototypeCtorClass =
    obj.prototype.constructor &&
    obj.prototype.constructor.toString &&
    obj.prototype.constructor.toString().substring(0, 5) === 'class'
  return isCtorClass || isPrototypeCtorClass
}

export function UseContainer<C extends ContainerType>(
  container: ((target: ComponentInterface) => C | Class<C>) | C | Class<C>,
  deleteOnUnmount?: boolean,
) {
  return (target: ComponentInterface, propertyKey: string): void => {
    const cont = (isClass(container)
      ? container
      : (container as (target: ComponentInterface) => C | Class<C>)(target)) as C | Class<C>

    const instance = isInstanceOfContainer(cont)
      ? (cont as C)
      : (findContainer(cont as Class<C>) as C)

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

export * from '@containrz/core'
