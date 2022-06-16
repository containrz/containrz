import { Class } from 'utility-types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  subscribeListener,
  findContainer,
  ContainerType,
  isInstanceOfContainer,
} from '@containrz/core'

interface BaseConfig<T> {
  deleteOnUnmount?: boolean
  onUpdate?: (nextState: T) => void
}

interface ConfigWithUpdater<T> extends BaseConfig<T> {
  shouldTriggerUpdate?: (
    nextState: ContainerType['state'],
    oldState: ContainerType['state'],
  ) => boolean
}

interface ConfigWithKeysToObserve<T> extends BaseConfig<T> {
  watchKeys?: Array<keyof T>
}

type Config<T> = ConfigWithKeysToObserve<T> | ConfigWithUpdater<T>

export function useContainer<T, C extends ContainerType<T>>(
  container: C | Class<C>,
  config?: Config<T>,
): C {
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
        if (isInstanceOfContainer((nextState as never) || {}) || !nextState) {
          forceUpdate(c => !c)
          return
        }
        if (!config || !('shouldTriggerUpdate' in config || 'watchKeys' in config)) {
          update(nextState)
          return
        }

        // Detect if should update when using shouldTriggerUpdate resolver
        if (
          'shouldTriggerUpdate' in config &&
          config.shouldTriggerUpdate(nextState || {}, oldState || {})
        ) {
          update(nextState)
        }
        // Detect if should update when using watchKeys array
        else if ('watchKeys' in config) {
          if (config.watchKeys.length === 0) {
            return
          }

          if (
            config.watchKeys.reduce(
              (acc, dep) =>
                acc ||
                (Boolean(nextState[dep]) &&
                  JSON.stringify(nextState[dep]) !== JSON.stringify(oldState[dep])),
              false as never,
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
