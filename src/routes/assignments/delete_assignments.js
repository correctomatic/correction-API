import authenticator from '#middleware/authenticator.js'
import {
  DELETE_OWN_ASSIGNMENT_SCHEMA,
  DELETE_FOREIGN_ASSIGNMENT_SCHEMA
} from '#schemas/assignment_schemas.js'
import { errorResponse } from '#lib/requests.js'
import { handleSequelizeError } from '#lib/errors.js'
import AssignmentPolicy from '#policies/assignment_policy.js'

export default async function routes(fastify, _options) {

  const Assignment = fastify.db.sequelize.models.Assignment

  fastify.addHook('preHandler', authenticator())

  async function deleteAssignment(username, request, reply) {
    const { assignment } = request.params

    try {

      const theAssignment = await Assignment.findOne({
        where: { username, assignment }
      })

      if (!theAssignment) {
        return reply.status(404).send(errorResponse('Assignment not found'))
      }

      const assignmentPolicy = new AssignmentPolicy(request.user, theAssignment)
      if (!assignmentPolicy.can('destroy')) {
        return reply.status(403).send(errorResponse('You are not authorized to delete this assignment'))
      }

      await theAssignment.destroy()
      return reply.status(204).send()

    } catch (error) {
      handleSequelizeError(error, reply, 'Error deleting assignment')
    }
  }

  // Delete an assignment for the current user
  fastify.delete(
    '/:assignment',
    { schema: DELETE_OWN_ASSIGNMENT_SCHEMA },
    async (request, reply) => {
      const { user } = request
      return deleteAssignment(user.username, request, reply)
    })

  // Delete an assignment for a different user (admin only)
  fastify.delete(
    '/:user/:assignment',
    { schema: DELETE_FOREIGN_ASSIGNMENT_SCHEMA },
    async (request, reply) => {
      const { user: username } = request.params
      return deleteAssignment(username, request, reply)
    })
}
