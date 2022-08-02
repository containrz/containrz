import { getEmitter } from '@containrz/core'
import AsyncStorage from '@react-native-community/async-storage'

export class NativeLocalStorageContainer<State = any> {
  public state!: State

  constructor(state: State) {
    this.state = state
    if (!localStorage) {
      return
    }

    AsyncStorage.getAllKeys(async (_, keys) => {
      if (!keys) {
        return
      }

      // when there are new values not yet stored, store default value
      if (keys.length !== Object.keys(this.state).length) {
        this.setItems(
          Object.keys(this.state)
            .filter(key => !keys.some(k => k === key))
            .reduce(
              (acc, key) => ({
                ...acc,
                [key]: this.state[key as keyof State],
              }),
              {},
            ),
        )
      }

      // when first time container is created, no need to load state
      if (keys.length === 0) {
        return
      }

      const storedState = {} as any
      await Promise.all(
        keys.map(key =>
          AsyncStorage.getItem(key).then(item => {
            storedState[key] = item
          }),
        ),
      )

      this.state = Object.assign({}, this.state, storedState) as State
      getEmitter(this).next(0)
    })
  }

  public setState = (updater: Partial<State> | ((prevState: State) => Partial<State> | null)) => {
    const nextState = updater instanceof Function ? updater(this.state) : updater
    if (nextState) {
      this.state =
        nextState instanceof Object ? Object.assign({}, this.state, nextState) : nextState

      if (!localStorage) {
        getEmitter(this).next(0)
        return
      }

      Object.keys(nextState).forEach(key => {
        AsyncStorage.setItem(
          `${this.constructor.name}-${key}`,
          JSON.stringify(nextState[key as keyof State]),
        )
      })

      getEmitter(this).next(0)
    }
  }

  public destroy = () => {}

  private setItems = (state: Partial<State>) =>
    Object.keys(state).forEach(key => {
      AsyncStorage.setItem(key, JSON.stringify(state[key as keyof State]))
    })
}
