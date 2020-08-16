import { Class } from 'utility-types'
import { useEffect, useState } from 'react'
import { subscribeListener, findContainer } from '@containrz/core'
import { ContainerType, isInstanceOfContainer } from '@containrz/types'

export function useContainer<C extends ContainerType>(
  container: C | Class<C>,
  deleteOnUnmount?: boolean
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
