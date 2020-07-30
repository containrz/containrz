import { Class } from 'utility-types'

export interface ContainerType<T = any> {
  setState: (updater: Partial<T> | ((prevState: T) => Partial<T> | null)) => void
  state: T
  destroy: () => void
}

export const isInstanceOfContainer = <C extends ContainerType>(container: C | Class<C>): boolean =>
  (container as ContainerType).setState !== undefined &&
  (container as ContainerType).state !== undefined
