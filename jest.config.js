module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: { '\\.ts$': ['ts-jest'] },
  setupFiles: ['jest-localstorage-mock', 'fake-indexeddb', 'raf/polyfill'],
  modulePathIgnorePatterns: ['<rootDir>/demos', '<rootDir>/dist'],
}
