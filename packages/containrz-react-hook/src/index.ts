import { Class } from 'utility-types'
import { useEffect, useState } from 'react'
import { subscribeListener, findContainer } from '@containrz/core'
import { ContainerType, isInstanceOfContainer } from '@containrz/types'

export function useContainer<C extends ContainerType>(
  container: C | Class<C>,
  deleteOnUnmount?: boolean
): C {
  const [, forceUpdate] = useState(0)
  const instance = isInstanceOfContainer(container)
    ? (container as C)
    : (findContainer(container as Class<C>) as C)

  useEffect(() => subscribeListener(instance, () => forceUpdate(c => c + 1), deleteOnUnmount), [
    instance,
  ])

  return instance
}
