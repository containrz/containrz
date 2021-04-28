import { Class } from 'utility-types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  subscribeListener,
  findContainer,
  ContainerType,
  isInstanceOfContainer,
} from '@containrz/core'

interface BaseConfig {
  deleteOnUnmount?: boolean
  onUpdate?: (nextState: any) => void
}

interface ConfigWithUpdater extends BaseConfig {
  shouldTriggerUpdate?: (
    nextState: ContainerType['state'],
    oldState: ContainerType['state'],
  ) => boolean
}

interface ConfigWithKeysToObserve extends BaseConfig {
  updateForKeys?: string[]
}

type Config = ConfigWithKeysToObserve | ConfigWithUpdater

export function useContainer<C extends ContainerType>(container: C | Class<C>, config?: Config): C {
  const [, forceUpdate] = useState(false)
  const instance = useMemo(
    () =>
      isInstanceOfContainer(container)
        ? (container as C)
        : (findContainer(container as Class<C>) as C),
    [],
  )

  if (!isInstanceOfContainer(instance)) {
    throw new Error('Container used does not meet the required implementation')
  }

  const update = useCallback(
    nextState => {
      forceUpdate(c => !c)
      config?.onUpdate?.(nextState)
    },
    [config?.onUpdate],
  )

  useEffect(() => {
    const unsubscribe = subscribeListener(
      instance,
      ({ nextState, oldState }) => {
        if (isInstanceOfContainer(nextState || {})) {
          forceUpdate(c => !c)
          return
        }
        if (!config || !('shouldTriggerUpdate' in config || 'updateForKeys' in config)) {
          update(nextState)
          return
        }

        if (
          'shouldTriggerUpdate' in config &&
          config.shouldTriggerUpdate(nextState || {}, oldState || {})
        ) {
          update(nextState)
        } else if ('updateForKeys' in config) {
          const keys = config.updateForKeys

          if (keys.length === 0) {
            return
          }

          if (
            keys.reduce(
              (acc, dep) =>
                acc ||
                (Boolean((nextState || {})[dep]) &&
                  JSON.stringify((nextState || {})[dep]) !== JSON.stringify((oldState || {})[dep])),
              false,
            )
          ) {
            update(nextState)
          }
        }
      },
      config?.deleteOnUnmount || false,
    )

    return unsubscribe
  }, [instance, update])

  return instance
}

export * from '@containrz/core'
