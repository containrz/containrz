import { Container } from './Container';
import { LocalStorageContainer } from './LocalStorageContainer';
import { Class } from 'utility-types';

export type ContainerType<T = any> = Container<T> | LocalStorageContainer<T>;

export const isInstanceOfContainer = <C>(container: C | Class<C>): boolean =>
  container instanceof Container || container instanceof LocalStorageContainer;
