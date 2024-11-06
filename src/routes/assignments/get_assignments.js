'use strict'

const authenticate = require('../../middleware/authenticate')


async function routes(fastify, _options) {

  const Assignment = fastify.db.sequelize.models.Assignment

  // Get all assignments for a user
  fastify.get(
    '/',
    async (request, reply) => {
      const assignments = await Assignment.findAll()
      return reply.send(assignments)
    })

  // Get a specific assignment by user and assignment ID
  fastify.get(
    '/:user',
    async (request, reply) => {
      const { user } = request.params
      const assignments = await Assignment.findAll({
        where: { user }
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
