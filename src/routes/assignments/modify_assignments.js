'use strict'

const authenticate = require('../../middleware/authenticate')

const {
  CREATE_ASSIGNMENT_SCHEMA,
  UPDATE_ASSIGNMENT_SCHEMA,
  DELETE_ASSIGNMENT_SCHEMA
} = require('../../schemas/assignment_schemas')

const { errorResponse } = require('../../lib/requests')
const NOT_A_SEQUELIZE_ERROR = Symbol('Not a Sequelize error')

function sequelizeError(error) {
  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors.map(e => `Field '${e.path}': ${e.message}`).join(', ')
    return (`Validation error(s): ${messages}`)
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return ('Duplicated assignment')
  }

  return NOT_A_SEQUELIZE_ERROR
}

function successResponse(assignment) {
  return {
    success: true,
    assignment: assignment.toJSON()
  }
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

        return reply.status(201).send(successResponse(newAssignment))
      } catch (error) {
        const userError = sequelizeError(error)
        if (userError === NOT_A_SEQUELIZE_ERROR) {
          return reply.status(500).send(errorResponse('Internal server error'))
        }
        return reply.status(400).send(errorResponse(userError))
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
        const userError = sequelizeError(error)
        if (userError === NOT_A_SEQUELIZE_ERROR) {
          return reply.status(500).send(errorResponse('Internal server error'))
        }
        return reply.status(400).send(errorResponse(userError))
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
        const userError = sequelizeError(error)
        if (userError === NOT_A_SEQUELIZE_ERROR) {
          return reply.status(500).send(errorResponse('Internal server error'))
        }
        return reply.status(400).send(errorResponse(userError))
      }
    })
}

module.exports = routes
