import { getEmitter } from '@containrz/core'

export class Container<State = any> {
  public state!: State

  public setState = (updater: Partial<State> | ((prevState: State) => Partial<State> | null)) => {
    const nextState = updater instanceof Function ? updater(this.state) : updater
    if (nextState) {
      this.state =
        nextState instanceof Object ? Object.assign({}, this.state, nextState) : nextState

      getEmitter(this).next(0)
    }
  }

  public destroy = () => {}
}
