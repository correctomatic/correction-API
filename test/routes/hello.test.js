import { expect, test } from 'vitest'
import app from '../../src/server'

test('GET /hello must greet', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/hello',
    query: {
      name: 'John'
    }
  })

  expect(response.statusCode).toBe(200)
  expect(response.body).toContain('Hello, world!')
})
