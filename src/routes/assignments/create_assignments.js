'use strict'

const authenticator = require('@middleware/authenticator.js')

const {
  CREATE_ASSIGNMENT_SCHEMA,
} = require('@schemas/assignment_schemas.js')

const { errorResponse, assignmentSuccessResponse } = require('@lib/requests.js')
const { handleSequelizeError } = require('@lib/errors.js')
const AssignmentPolicy = require('@policies/assignment_policy.js')

async function routes(fastify, _options) {

  const Assignment = fastify.db.sequelize.models.Assignment
  const User = fastify.db.sequelize.models.User

  fastify.addHook('preHandler', authenticator())

  async function createAssignment(forUserName, request, reply) {

    const { user: loggedUser } = request
    const { assignment, image, params, allowed_user_params } = request.body

    try {

      const newAssignment = Assignment.build({
        username: forUserName,
        assignment,
        image,
        params,
        allowed_user_params
      })

      const assignmentPolicy = new AssignmentPolicy(loggedUser, newAssignment)
      if (!assignmentPolicy.can('create')) {
        return reply.status(403).send(errorResponse('You are not authorized to create an assignment for this user.'));
      }

      const forUser = await User.findOne({
        where: { username: forUserName }
      })
      if (!forUser) return reply.status(404).send(errorResponse('User not found'))

      await newAssignment.save()
      return reply.status(201).send(assignmentSuccessResponse(newAssignment))
    } catch (error) {
      handleSequelizeError(error, reply, 'Error creating assignment')
    }
  }

  // Create a new assignment for the current user
  fastify.post(
    '/',
    { schema: CREATE_ASSIGNMENT_SCHEMA },
    async (request, reply) => {
      const { user } = request
      return createAssignment(user.username, request, reply)
    })

  // Create a new assignment for a different user (admin only)
  fastify.post(
    '/:user',
    { schema: CREATE_ASSIGNMENT_SCHEMA },
    async (request, reply) => {
      const { user: forUsername } = request.params
      return createAssignment(forUsername, request, reply)
    })

}

module.exports = routes
