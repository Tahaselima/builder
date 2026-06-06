export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/__tests__/stores', '<rootDir>/__tests__/components'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^nanoid$': '<rootDir>/__tests__/__mocks__/nanoid.js',
    '\\.(scss|css)$': '<rootDir>/__tests__/__mocks__/style.js'
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json']
}
