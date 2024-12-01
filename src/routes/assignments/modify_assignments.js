'use strict'

const authenticator = require('../../middleware/authenticator')

const {
  CREATE_ASSIGNMENT_SCHEMA,
  UPDATE_OWN_ASSIGNMENT_SCHEMA,
  UPDATE_FOREIGN_ASSIGNMENT_SCHEMA,
  DELETE_OWN_ASSIGNMENT_SCHEMA,
  DELETE_FOREIGN_ASSIGNMENT_SCHEMA
} = require('../../schemas/assignment_schemas')

const { errorResponse } = require('../../lib/requests')
const { handleSequelizeError } = require('../../lib/errors')
const AssignmentPolicy = require('../../policies/assignment_policy.js')
const { userNameToUser } = require('../../lib/utils')

function successResponse(assignment) {
  return {
    success: true,
    assignment: userNameToUser(assignment)
  }
}

async function routes(fastify, _options) {

  const Assignment = fastify.db.sequelize.models.Assignment
  const User = fastify.db.sequelize.models.User

  fastify.addHook('preHandler', authenticator())

  // Create a new assignment for the current user
  fastify.post(
    '/',
    { schema: CREATE_ASSIGNMENT_SCHEMA },
    async (request, reply) => {
      const { user } = request
      const { assignment, image, params, allowed_user_params } = request.body

      try {
        const newAssignment = await Assignment.create({
          user: user.user,
          assignment,
          image,
          params,
          allowed_user_params
        })

        return reply.status(201).send(successResponse(newAssignment))
      } catch (error) {
        handleSequelizeError(error, reply, 'Error creating assignment')
      }
    })

  // Create a new assignment for a different user (admin only)
  fastify.post(
    '/:user',
    { schema: CREATE_ASSIGNMENT_SCHEMA },
    async (request, reply) => {


      const { user } = request
      const { assignment, image, params, allowed_user_params } = request.body

      try {
        const newAssignment = await Assignment.create({
          user: user.user,
          assignment,
          image,
          params,
          allowed_user_params
        })
        const assignmentPolicy = new AssignmentPolicy(request.user, request.params.user)

        return reply.status(201).send(successResponse(newAssignment))
      } catch (error) {
        handleSequelizeError(error, reply, 'Error creating assignment')
      }
    })

    async function updateAssignment(username, request, reply) {
      const { assignment } = request.params
      const { image, params, allowed_user_params } = request.body

      try {

        const theAssignment = await Assignment.findOne({
          where: { username: username, assignment }
        })

        if (!theAssignment) {
          return reply.status(404).send(errorResponse('Assignment not found'))
        }

        const assignmentPolicy = new AssignmentPolicy(request.user, theAssignment)
        if (!assignmentPolicy.can('edit')) {
          return reply.status(403).send(errorResponse('You are not authorized to edit this assignment'))
        }

        await theAssignment.update({ image, params, allowed_user_params })
        return reply.send(successResponse(theAssignment))

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
      const { user:username } = request.params
      return updateAssignment(username, request, reply)
    })

  // Delete an assignment for the current user
  fastify.delete(
    '/:assignment',
    { schema: DELETE_OWN_ASSIGNMENT_SCHEMA },
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

  // Delete an assignment for a different user (admin only)
  fastify.delete(
    '/:user/:assignment',
    { schema: DELETE_FOREIGN_ASSIGNMENT_SCHEMA },
    async (request, reply) => {

      throw new Error('Not implemented')
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
