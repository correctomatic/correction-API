'use strict'

const authenticate = require('../../middleware/authenticate')
const { validateQueryParams, errorResponse } = require('../../lib/requests')
const { GET_ASSIGNMENT_SCHEMA, GET_ASSIGNMENTS_SCHEMA } = require('../../schemas/assignment_schemas')

const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

async function setLimitAndOffset(request, _reply) {
  let { limit, offset = 0 } = request.query
  request.limit = Math.min(parseInt(limit) || DEFAULT_LIMIT, MAX_LIMIT)
  request.offset = parseInt(offset) || 0
}

async function routes(fastify, _options) {

  const Assignment = fastify.db.sequelize.models.Assignment

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
        return reply.send(assignments)
      } catch (error) {
        console.error(error)
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
          where: { user }, limit, offset
        })

        return reply.send(assignments)
      } catch (error) {
        console.error(error)
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
          where: { user, assignment }
        })

        if (!theAssignment) {
          return reply.status(404).send(errorResponse('Assignment not found'))
        }
        return reply.send(theAssignment)
      } catch (error) {
        console.error(error)
        return reply.status(500).send(errorResponse('Internal server error'))
      }
    })

}

module.exports = routes
