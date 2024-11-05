// src/routes/assignmentRoutes.js
'use strict'

const { Assignment } = require('../models')
const { authenticate } = require('../middleware/authenticate')

const {
  CREATE_ASSIGNMENT_SCHEMA,
  UPDATE_ASSIGNMENT_SCHEMA,
  DELETE_ASSIGNMENT_SCHEMA
} = require('../schemas/assignment_schemas')

async function routes(fastify, _options) {

  fastify.addHook('preHandler', authenticate)

  // Get all assignments for a user
  fastify.get(
    '/assignments',
    async (request, reply) => {
      const { user } = request
      const assignments = await Assignment.findAll({ where: { user: user.id } })
      return reply.send(assignments)
    })

  // Get a specific assignment by user and assignment ID
  fastify.get(
    '/assignments/:assignmentId',
    async (request, reply) => {
      const { user } = request
      const { assignmentId } = request.params
      const assignment = await Assignment.findOne({
        where: { user: user.id, assignment: assignmentId }
      })

      if (!assignment) {
        return reply.status(404).send({ message: 'Assignment not found' })
      }
      return reply.send(assignment)
    })

  // Create a new assignment
  fastify.post(
    '/assignments',
    { schema: CREATE_ASSIGNMENT_SCHEMA },
    async (request, reply) => {
      const { user } = request
      const { assignment, image, params, user_params } = request.body

      try {
        const newAssignment = await Assignment.create({
          user: user.id,
          assignment,
          image,
          params,
          user_params
        })
        return reply.status(201).send(newAssignment)
      } catch (error) {
        return reply.status(400).send({ message: 'Error creating assignment', error })
      }
    })

  // Update an existing assignment
  fastify.put(
    '/assignments/:assignmentId',
    { schema: UPDATE_ASSIGNMENT_SCHEMA },
    async (request, reply) => {
      const { user } = request
      const { assignmentId } = request.params
      const { image, params, user_params } = request.body

      const assignment = await Assignment.findOne({
        where: { user: user.id, assignment: assignmentId }
      })

      if (!assignment) {
        return reply.status(404).send({ message: 'Assignment not found' })
      }

      await assignment.update({ image, params, user_params })
      return reply.send(assignment)
    })

  // Delete an assignment
  fastify.delete(
    '/assignments/:assignmentId',
    { schema: DELETE_ASSIGNMENT_SCHEMA },
    async (request, reply) => {
      const { user } = request
      const { assignmentId } = request.params

      const assignment = await Assignment.findOne({
        where: { user: user.id, assignment: assignmentId }
      })

      if (!assignment) {
        return reply.status(404).send({ message: 'Assignment not found' })
      }

      await assignment.destroy()
      return reply.status(204).send()
    })
}

module.exports = routes
