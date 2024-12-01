// Code from: https://github.com/pundit-community/pundit.js

class Policy {
  #user
  #record
  #actions

  constructor(user, record) {
    this.#user = user
    this.#record = record
    this.#actions = new Map()
  }

  get user() { return this.#user }
  get record() { return this.#record }
  
  can(actionName) {
    const actionFn = this.#actions.get(actionName)
    return actionFn !== undefined ? actionFn(this.#user, this.#record) : false
  }

  add(actionName, actionFn) {
    this.#actions.set(actionName, actionFn)
  }

  copy(user, record) {
    const newPolicy = new Policy(user || this.#user, record || this.#record)
    this.#actions.forEach((actionFunction, actionName) => {
      newPolicy.add(actionName, actionFunction)
    })
    return newPolicy
  }

  setup() {
    const actionNames = Object.getOwnPropertyNames(
      this.constructor.prototype
    ).filter((methodName) => methodName !== 'constructor')
    this.#actions = new Map(
      actionNames.map((actionName) => [
        actionName,
        () => this[actionName](),
      ])
    )
  }
}

module.exports = Policy
