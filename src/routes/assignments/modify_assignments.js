'use strict'

const authenticate = require('../../middleware/authenticate')

const {
  CREATE_ASSIGNMENT_SCHEMA,
  UPDATE_ASSIGNMENT_SCHEMA,
  DELETE_ASSIGNMENT_SCHEMA
} = require('../../schemas/assignment_schemas')

const { errorResponse } = require('../../lib/requests')

function errorForUser(error) {
  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors.map(e => `Field '${e.path}': ${e.message}`).join(', ')
    return(`Validation error(s): ${messages}`)
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return('Duplicated assignment')
  }

  // Handle other errors
  return('Error creating assignment')
}

async function routes(fastify, _options) {

  const Assignment = fastify.db.sequelize.models.Assignment

  fastify.addHook('preHandler', authenticate)

  // Create a new assignment
  fastify.post(
    '/',
    { schema: CREATE_ASSIGNMENT_SCHEMA },
    async (request, reply) => {
      const { user } = request
      const { assignment, image, params, user_params } = request.body

      try {
        const newAssignment = await Assignment.create({
          user: user.user,
          assignment,
          image,
          params,
          user_params
        })
        return reply.status(201).send(newAssignment)
      } catch (error) {
        const userError = errorForUser(error)
        return reply.status(400).send(errorResponse(userError))
      }
    })

  // Update an existing assignment
  fastify.put(
    '/:assignment',
    { schema: UPDATE_ASSIGNMENT_SCHEMA },
    async (request, reply) => {
      const { user } = request
      const { assignment } = request.params
      const { image, params, user_params } = request.body

      const theAssignment = await Assignment.findOne({
        where: { user, assignment }
      })

      if (!assignment) {
        return reply.status(404).send({ message: 'Assignment not found' })
      }

      await assignment.update({ image, params, user_params })
      return reply.send(assignment)
    })

  // Delete an assignment
  fastify.delete(
    '/:assignment',
    { schema: DELETE_ASSIGNMENT_SCHEMA },
    async (request, reply) => {
      const { user } = request
      const { assignment } = request.params

      const theAssignment = await Assignment.findOne({
        where: { user: user.id, assignment: assignmentId }
      })

      if (!theAssignment) {
        return reply.status(404).send({ message: 'Assignment not found' })
      }

      await theAssignment.destroy()
      return reply.status(204).send()
    })
}

module.exports = routes
