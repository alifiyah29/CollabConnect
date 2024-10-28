module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.js'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/index.js',
      '!src/config/*.js'
    ]
  };