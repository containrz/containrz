import { Class } from 'utility-types'
import { useEffect, useState } from 'react'
import {
  subscribeListener,
  findContainer,
  ContainerType,
  isInstanceOfContainer,
} from '@containrz/core'

export function useContainer<C extends ContainerType>(
  container: C | Class<C>,
  deleteOnUnmount?: boolean,
): C {
  const [, forceUpdate] = useState(false)
  const instance = isInstanceOfContainer(container)
    ? (container as C)
    : (findContainer(container as Class<C>) as C)

  useEffect(() => {
    const unsubscribe = subscribeListener(instance, () => forceUpdate(c => !c), deleteOnUnmount)

    return unsubscribe
  }, [instance, forceUpdate])

  return instance
}

export * from '@containrz/core'
