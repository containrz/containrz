module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: { '\\.ts$': ['ts-jest'] },
  setupFiles: ['jest-localstorage-mock'],
  modulePathIgnorePatterns: ['<rootDir>/demos'],
}
