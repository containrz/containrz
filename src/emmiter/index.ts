import { BehaviorSubject } from 'rxjs';
import { ContainerType } from '../containers/types';
import { Class } from 'utility-types';

export const emittersMap = new Map<ContainerType<any>, BehaviorSubject<any>>();

export const getEmitter = (container: ContainerType<any>): BehaviorSubject<any> => {
  if (!emittersMap.has(container)) {
    const emitter = new BehaviorSubject(container);
    emittersMap.set(container, emitter);
    return emitter;
  }

  return emittersMap.get(container)!;
};

export const containersMap = new Map<Class<ContainerType<any>>, ContainerType<any>>();

export const findContainer = <C>(c: Class<ContainerType<any>>): ContainerType<C> => {
  if (!containersMap.has(c)) containersMap.set(c, new c());

  return containersMap.get(c)!;
};
