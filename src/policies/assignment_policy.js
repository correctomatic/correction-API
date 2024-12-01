import { Policy } from 'pundit'

class AssignmentPolicy extends Policy {
  constructor(user, assignment) {
    super(user, assignment)
    this.setup.apply(this)
  }

  create() {
    const userIsAdmin = this.user.isAdmin
    const userIsOwner = this.user.username === this.assignment.username
    return userIsOwner || userIsAdmin
  }

  edit() {
    return this.user.id === this.record.userId
  }

  destroy() {
    return this.edit()
  }
}

module.exports = AssignmentPolicy
