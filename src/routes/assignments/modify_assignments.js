'use strict'

const authenticator = require('../../middleware/authenticator')

const {
  CREATE_ASSIGNMENT_SCHEMA,
  UPDATE_ASSIGNMENT_SCHEMA,
  DELETE_ASSIGNMENT_SCHEMA
} = require('../../schemas/assignment_schemas')

const { errorResponse } = require('../../lib/requests')
const { handleSequelizeError } = require('../../lib/errors')

function successResponse(assignment) {
  return {
    success: true,
    assignment: assignment.toJSON()
  }
}

async function routes(fastify, _options) {

  const Assignment = fastify.db.sequelize.models.Assignment

  fastify.addHook('preHandler', authenticator())

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

        return reply.status(201).send(successResponse(newAssignment))
      } catch (error) {
        handleSequelizeError(error, reply, 'Error creating assignment')
      }
    })

  // Update an existing assignment
  fastify.put(
    '/:user/:assignment',
    { schema: UPDATE_ASSIGNMENT_SCHEMA },
    async (request, reply) => {
      const { user, assignment } = request.params
      const { image, params, user_params } = request.body

      try {

        const theAssignment = await Assignment.findOne({
          where: { user, assignment }
        })

        if (!theAssignment) {
          return reply.status(404).send(errorResponse('Assignment not found'))
        }

        await theAssignment.update({ image, params, user_params })
        return reply.send(successResponse(theAssignment))

      } catch (error) {
        handleSequelizeError(error, reply, 'Error updating assignment')
      }
    })

  // Delete an assignment
  fastify.delete(
    '/:user/:assignment',
    { schema: DELETE_ASSIGNMENT_SCHEMA },
    async (request, reply) => {
      const { user, assignment } = request.params

      try {
        const theAssignment = await Assignment.findOne({
          where: { user, assignment }
        })

        if (!theAssignment) {
          return reply.status(404).send(errorResponse('Assignment not found'))
        }

        await theAssignment.destroy()
        return reply.status(204).send()

      } catch (error) {
        handleSequelizeError(error, reply, 'Error deleting assignment')
      }
    })
}

module.exports = routes
