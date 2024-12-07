const Policy = require('./policy.js')

class UserPolicy extends Policy {
  constructor(loggedUser, user) {
    super(loggedUser, user)
    this.setup.apply(this)
  }

  #isAdmin() {
    return this.user.roles?.includes('admin')
  }

  #sameUser() {
    return this.user.id === this.record.id
  }

  #onlyEditPassword() {
    return this.record.editedFields.length === 1 && this.record.editedFields.includes('password')
  }

  list() {
    return this.#isAdmin()
  }

  create() {
    return this.#isAdmin()
  }

  edit() {
    return this.#isAdmin() || ( this.#sameUser() && this.#onlyEditPassword() )
  }

  destroy() {
    return this.#isAdmin()
  }
}

module.exports = UserPolicy
