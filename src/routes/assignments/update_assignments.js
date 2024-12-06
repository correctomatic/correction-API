'use strict'

const authenticator = require('../../middleware/authenticator.js')

const {
  UPDATE_OWN_ASSIGNMENT_SCHEMA,
  UPDATE_FOREIGN_ASSIGNMENT_SCHEMA,
} = require('../../schemas/assignment_schemas.js')

const { errorResponse, assignmentSuccessResponse } = require('../../lib/requests.js')
const { handleSequelizeError } = require('../../lib/errors.js')
const AssignmentPolicy = require('../../policies/assignment_policy.js')

async function routes(fastify, _options) {

  const Assignment = fastify.db.sequelize.models.Assignment

  fastify.addHook('preHandler', authenticator())

  async function updateAssignment(username, request, reply) {
    const { assignment } = request.params
    const { image, params, allowed_user_params } = request.body

    try {

      const theAssignment = await Assignment.findOne({
        where: { username, assignment }
      })

      if (!theAssignment) {
        return reply.status(404).send(errorResponse('Assignment not found'))
      }

      const assignmentPolicy = new AssignmentPolicy(request.user, theAssignment)
      if (!assignmentPolicy.can('edit')) {
        return reply.status(403).send(errorResponse('You are not authorized to edit this assignment'))
      }

      await theAssignment.update({ image, params, allowed_user_params })
      return reply.send(assignmentSuccessResponse(theAssignment))

    } catch (error) {
      handleSequelizeError(error, reply, 'Error updating assignment')
    }
  }

  // Update an existing assignment for the current user
  fastify.put(
    '/:assignment',
    { schema: UPDATE_OWN_ASSIGNMENT_SCHEMA },
    async (request, reply) => {
      const { user } = request
      return updateAssignment(user.username, request, reply)
    })

  // Update an existing assignment for a different user (admin only)
  fastify.put(
    '/:user/:assignment',
    { schema: UPDATE_FOREIGN_ASSIGNMENT_SCHEMA },
    async (request, reply) => {
      const { user: username } = request.params
      return updateAssignment(username, request, reply)
    })
}

module.exports = routes
