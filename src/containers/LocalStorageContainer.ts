import { getEmitter } from '../emmiter';

export class LocalStorageContainer<State = any> {
  public state!: State;

  constructor(state: State) {
    if (!localStorage) {
      this.state = state;
      return;
    }

    const keys = Object.keys(localStorage).filter(
      key => key.startsWith(`${this.constructor.name}-`) && localStorage.getItem(key) !== null
    );

    const storedState = keys.reduce(
      (acc, key) => ({
        ...acc,
        [key.split('-')[1]]: JSON.parse(localStorage.getItem(key) || 'null'),
      }),
      {}
    ) as State;

    this.state = Object.assign({}, state, storedState);
  }

  public setState = (updater: Partial<State> | ((prevState: State) => Partial<State> | null)) => {
    const nextState = updater instanceof Function ? updater(this.state) : updater;
    if (nextState) {
      this.state =
        nextState instanceof Object ? Object.assign({}, this.state, nextState) : nextState;

      if (!localStorage) {
        getEmitter(this).next(0);
        return;
      }

      Object.keys(nextState).forEach(key => {
        localStorage.setItem(`${this.constructor.name}-${key}`, JSON.stringify(nextState[key]));
      });

      getEmitter(this).next(0);
    }
  };

  public destroy = () => {};
}
