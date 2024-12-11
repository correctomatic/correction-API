import Policy from './policy.js'

class AssignmentPolicy extends Policy {
  constructor(user, assignment) {
    super(user, assignment)
    this.setup.apply(this)
  }

  #adminOrOwner() {
    const userIsAdmin = this.user.roles?.includes('admin')
    const userIsOwner = this.user.username === this.record.username
    return userIsOwner || userIsAdmin
  }

  create() {
    return this.#adminOrOwner()
  }

  edit() {
    return this.#adminOrOwner()
  }

  destroy() {
    return this.#adminOrOwner()
  }
}

export default AssignmentPolicy
