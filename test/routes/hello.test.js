const app = require('../../src/server');

test('GET /api/users should return a list of users', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/api/users',
  });

  expect(response.statusCode).toBe(200);
  expect(response.json()).toHaveProperty('users');
})
