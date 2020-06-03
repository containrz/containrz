import { useEffect, useState } from 'react';
import { Class } from 'utility-types';
import { isInstanceOfContainer, ContainerType } from './containers/types';
import { getEmitter, emittersMap, containersMap, findContainer } from './emmiter';

export * from './containers';

export const clearContainers = () => {
  Array.from(containersMap.keys()).map(key => {
    const container = getContainer(key);
    container.destroy();
  });

  containersMap.clear();
  emittersMap.clear();
};

const subscribeListener = (
  container: ContainerType<any>,
  listener: () => void,
  deleteOnUnmount?: boolean
) => {
  const emitter = getEmitter(container);
  const sub = emitter.subscribe(listener);

  return () => {
    sub.unsubscribe();

    if (deleteOnUnmount) {
      emittersMap.delete(container);
    }
  };
};

export function getContainer<C extends ContainerType>(container: C | Class<C>): C {
  return isInstanceOfContainer(container)
    ? (container as C)
    : (findContainer(container as Class<C>) as C);
}

export function useContainer<C extends ContainerType>(
  container: C | Class<C>,
  deleteOnUnmount?: boolean
): C {
  const [, forceUpdate] = useState(0);
  const instance = isInstanceOfContainer(container)
    ? (container as C)
    : (findContainer(container as Class<C>) as C);

  useEffect(() => subscribeListener(instance, () => forceUpdate(c => c + 1), deleteOnUnmount), [
    instance,
  ]);

  return instance;
}
