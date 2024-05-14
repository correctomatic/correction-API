import amqp from 'amqplib'
import env from './env.js'

const RABBITMQ_URL=env.rabbit.RABBITMQ_URL

// We share a connection between all the modules
const connection = null

function connectionURL() {
  return RABBITMQ_URL
}

async function connect() {
  return await amqp.connect(connectionURL())
}

async function getConnection() {
  return connection || connect()
}

async function getMessageChannel() {
  const connection = await getConnection()
  return connection.createChannel()
}

export const PENDING_QUEUE = 'pending_corrections'
export const RUNNING_QUEUE = 'running_corrections'
export const FINISHED_QUEUE = 'finished_corrections'
export {
  getMessageChannel
}

