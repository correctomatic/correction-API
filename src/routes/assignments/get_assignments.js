'use strict'

const logger = require('../../logger')
const { validateQueryParams, errorResponse, setLimitAndOffset } = require('@lib/requests')
const { GET_ASSIGNMENT_SCHEMA, GET_ASSIGNMENTS_SCHEMA } = require('@schemas/assignment_schemas')

const authenticator = require('../../middleware/authenticator')
const { userNameToUser } = require('@lib/utils')

async function routes(fastify, _options) {

  const Assignment = fastify.db.sequelize.models.Assignment

  fastify.addHook('preHandler', authenticator())

  // Get all assignments for a user
  fastify.get(
    '/',
    {
      schema: GET_ASSIGNMENTS_SCHEMA,
      preHandler: [validateQueryParams(GET_ASSIGNMENTS_SCHEMA), setLimitAndOffset]
    },
    async (request, reply) => {
      try {
        const { limit, offset } = request
        const assignments = await Assignment.findAll({ limit, offset })
        return reply.send(assignments.map(userNameToUser))
      } catch (error) {
        logger.error(error)
        return reply.status(500).send(errorResponse('Internal server error'))
      }
    })

  // Get a specific assignment by user and assignment ID
  fastify.get(
    '/:user',
    {
      schema: GET_ASSIGNMENTS_SCHEMA,
      preHandler: [validateQueryParams(GET_ASSIGNMENTS_SCHEMA), setLimitAndOffset]
    },
    async (request, reply) => {
      try {
        const { limit, offset } = request
        const { user } = request.params
        const assignments = await Assignment.findAll({
          where: { username: user }, limit, offset
        })

        return reply.send(assignments.map(userNameToUser))
      } catch (error) {
        logger.error(error)
        return reply.status(500).send(errorResponse('Internal server error'))
      }
    })

  // Get a specific assignment by user and assignment ID
  fastify.get(
    '/:user/:assignment',
    {
      schema: GET_ASSIGNMENT_SCHEMA,
      preHandler: validateQueryParams(GET_ASSIGNMENT_SCHEMA)
    },
    async (request, reply) => {
      try {
        const { user } = request.params
        const { assignment } = request.params
        const theAssignment = await Assignment.findOne({
          where: { username: user, assignment }
        })

        if (!theAssignment) {
          return reply.status(404).send(errorResponse('Assignment not found'))
        }
        return reply.send(userNameToUser(theAssignment))
      } catch (error) {
        logger.error(error)
        return reply.status(500).send(errorResponse('Internal server error'))
      }
    })

}

module.exports = routes
