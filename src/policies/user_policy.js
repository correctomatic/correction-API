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
    return this.loggedUser.id === this.user.id
  }

  #onlyEditPassword() {
    return this.user.editedFields.length === 1 && this.user.editedFields.includes('password')
  }

  create() {
    this.#isAdmin()
  }

  edit() {
    return this.#isAdmin() || ( this.#sameUser() && this.#onlyEditPassword() )
  }

  destroy() {
    this.#isAdmin()
  }
}

module.exports = UserPolicy
