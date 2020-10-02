import { getEmitter } from '@containrz/core'
import { createInstance, dropInstance, INDEXEDDB, WEBSQL, LOCALSTORAGE } from 'localforage'

export class IndexedDBContainer<State = any> {
  public state!: State

  private instance: LocalForage

  constructor(state: State) {
    this.instance = createInstance({
      name: this.constructor.name,
      driver: [INDEXEDDB, WEBSQL, LOCALSTORAGE],
    })

    this.state = state

    this.instance.keys(async (_, keys) => {
      if (keys.length !== Object.keys(state).length) {
        this.setItems(
          Object.keys(state)
            .filter(key => !keys.some(k => k === key))
            .reduce(
              (acc, key) => ({
                ...acc,
                [key]: state[key],
              }),
              {}
            )
        )
      }

      if (keys.length === 0) {
        return
      }

      const storedState = {}
      await Promise.all(
        keys.map(key =>
          this.instance.getItem(key).then(item => {
            storedState[key] = item
          })
        )
      )

      this.state = Object.assign({}, state, storedState) as State
      getEmitter(this).next(0)
    })
  }

  public setState = (updater: Partial<State> | ((prevState: State) => Partial<State> | null)) => {
    const nextState = updater instanceof Function ? updater(this.state) : updater
    if (nextState) {
      this.state =
        nextState instanceof Object ? Object.assign({}, this.state, nextState) : nextState

      this.setItems(nextState)

      getEmitter(this).next(0)
    }
  }

  private setItems = (state: Partial<State>) =>
    Object.keys(state).forEach(key => {
      this.instance.setItem(key, state[key])
    })

  public destroy = () =>
    dropInstance({
      name: this.constructor.name,
    })
}
