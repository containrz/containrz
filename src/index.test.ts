import { act, renderHook } from 'react-hooks-testing-library';
import { Container, useContainer, LocalStorageContainer, clearContainers } from '.';

/**
 *  Tests for simple container
 */
interface State {
  num: number;
}

class Num extends Container<State> {
  state = {
    num: 0,
  };

  public setNum = (num: number) => this.setState({ num });
}

/**
 *  Tests for complex state
 */
interface ObjectContainerState {
  name: string;
  age: number;
  items: Array<string>;
}

class ObjectContainer extends Container<ObjectContainerState> {
  public state = {
    name: '',
    age: 0,
    items: [] as string[],
  };

  public setName = (name: string) => this.setState({ name });

  public setAge = (age: number) => this.setState({ age });

  public addItem = (item: string) => this.setState(s => ({ items: [...s.items, item] }));
}

class ObjectContainerLocalStorage extends LocalStorageContainer<ObjectContainerState> {
  constructor() {
    super({
      name: '',
      age: 0,
      items: [] as string[],
    });
  }

  public setName = (name: string) => this.setState({ name });

  public setAge = (age: number) => this.setState({ age });

  public addItem = (item: string) => this.setState(s => ({ items: [...s.items, item] }));
}

describe('`useContainer` tests', () => {
  beforeEach(() => {
    clearContainers();
  });

  afterAll(() => {
    // values stored in tests will also be available in other tests unless you run
    localStorage.clear();
    // or directly reset the storage
    localStorage.__STORE__ = {};
    // you could also reset all mocks, but this could impact your other mocks
    jest.resetAllMocks();
    // or individually reset a mock used
  });

  it('Sets num', () => {
    const { result } = renderHook(() => useContainer(Num));
    const container = result.current;

    expect(container.state.num).toBe(0);

    act(() => container.setNum(12));
    expect(container.state.num).toBe(12);
  });

  it('Updates state with complex object', () => {
    const { result } = renderHook(() => useContainer(ObjectContainer));
    const container = result.current;

    act(() => container.setAge(12));
    expect(container.state.age).toBe(12);

    act(() => container.setName('Nic'));
    expect(container.state.name).toBe('Nic');

    act(() => container.addItem('Ball'));
    expect(container.state.items.length).toBe(1);
  });

  it('Updates state with complex object and stores to localStorage', () => {
    const { result } = renderHook(() => useContainer(ObjectContainerLocalStorage));
    const container = result.current;

    act(() => container.setName('Nic'));
    expect(container.state.name).toBe('Nic');
    expect(localStorage.getItem('ObjectContainerLocalStorage-name')).toBe(JSON.stringify('Nic'));

    act(() => container.addItem('Ball'));
    expect(container.state.items.length).toBe(1);
    expect(localStorage.getItem('ObjectContainerLocalStorage-items')).toBe(
      JSON.stringify(['Ball'])
    );
  });

  it('Loads state with local storage.', () => {
    const { result } = renderHook(() => useContainer(ObjectContainerLocalStorage));
    const container = result.current;

    // since age wasn't set before,
    // value should be the one set by default state
    expect(container.state.age).toBe(0);
    expect(localStorage.getItem('ObjectContainerLocalStorage-age')).toBeNull;

    expect(container.state.name).toBe('Nic');
    expect(localStorage.getItem('ObjectContainerLocalStorage-name')).toBe(JSON.stringify('Nic'));

    expect(container.state.items.length).toBe(1);
    expect(localStorage.getItem('ObjectContainerLocalStorage-items')).toBe(
      JSON.stringify(['Ball'])
    );
  });

  it('Should call destroy.', () => {
    const { result } = renderHook(() => useContainer(ObjectContainerLocalStorage));
    const container = result.current;

    container.destroy = jest.fn();

    clearContainers();

    expect(container.destroy).toHaveBeenCalled();
  });
});
