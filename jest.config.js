const aliases = require('module-alias-jest/register')

module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'babel-jest', // Use Babel to transform JavaScript/TypeScript files
  },
  transformIgnorePatterns: [
    // Ensure no files in node_modules are ignored
    // This pattern will not ignore any files in node_modules
    '/node_modules/(?!.*)',
  ],
  verbose: true,
  testMatch: ['<rootDir>/test/**/*.test.js'],
  // globalSetup: './test/global-setup.js',
  // globalTeardown: './test/global-teardown.js',
  moduleNameMapper: {
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    "uuid": require.resolve('uuid'),
    ...aliases.jest // Uses module-alias aliases in Jest
  }
}
