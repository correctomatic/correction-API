'use strict'

const authenticate = require('../../middleware/authenticate')
const { GET_ASSIGNMENTS_SCHEMA } = require('../../schemas/assignments/get_assignments_schemas')

const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

const setLimitAndOffset = async (request, _reply) => {
  let { limit, offset = 0 } = request.query
  request.limit = Math.min(parseInt(limit) || DEFAULT_LIMIT, MAX_LIMIT)
  request.offset = parseInt(offset) || 0
}

function validateQueryParams(schema) {

  return async function (request, reply) {

    const allowedParams = Object.keys(schema.querystring.properties)
    const queryParams = Object.keys(request.query)

    // Check for any unexpected query parameters
    const extraParams = queryParams.filter(param => !allowedParams.includes(param))
    if (extraParams.length > 0) {
      console.log('extraParams:', extraParams)
      reply.status(400).send({
        success: false,
        message: `Invalid query parameter(s): ${extraParams.join(', ')}`
      })
      return
    }
  }
}

async function routes(fastify, _options) {

  const Assignment = fastify.db.sequelize.models.Assignment

  // Get all assignments for a user
  fastify.get(
    '/',
    {
      schema: GET_ASSIGNMENTS_SCHEMA,
      preHandler: validateQueryParams(GET_ASSIGNMENTS_SCHEMA),
      // preHandler: [ /* validateQueryParams(GET_ASSIGNMENTS_SCHEMA), */ setLimitAndOffset ]
    },
    async (request, reply) => {

      try {
        const { limit, offset } = request
        const assignments = await Assignment.findAll({ limit, offset })
        return reply.send(assignments)
      } catch (error) {
        console.error(error)
        return reply.status(500).send({ message: 'Internal server error' })
      }
    })

  // Get a specific assignment by user and assignment ID
  fastify.get(
    '/:user',
    { preHandler: setLimitAndOffset },
    async (request, reply) => {
      const { limit, offset } = request
      const { user } = request.params
      const assignments = await Assignment.findAll({
        where: { user }, limit, offset
      })

      return reply.send(assignments)
    })

  // Get a specific assignment by user and assignment ID
  fastify.get(
    '/:user/:assignment',
    async (request, reply) => {
      const { user } = request.params
      const { assignment } = request.params
      const theAssignment = await Assignment.findOne({
        where: { user, assignment }
      })

      if (!theAssignment) {
        return reply.status(404).send({ message: 'Assignment not found' })
      }
      return reply.send(theAssignment)
    })

}

module.exports = routes
