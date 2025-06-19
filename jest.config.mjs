export default {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: './coverage-jest/',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    'cypress/**/*.js',
    'config/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.cy.js',
    '!src/{App,entry,entry-dev}.js',
    '!src/**/__fixtures__/*.js',
    '!src/**/__factories__/*.js',
  ],
  setupFiles: ['<rootDir>/config/setupTests.js'],
  roots: ['<rootDir>/src/'],
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|p-all|p-map|aggregate-error|indent-string|clean-stack))',
  ],
  moduleNameMapper: {
    '\\.(css|scss|svg)$': 'identity-obj-proxy',
    '^SmartComponents$': '<rootDir>/src/SmartComponents',
    '^SmartComponents/(.*)': '<rootDir>/src/SmartComponents/$1',
    '^PresentationalComponents$': '<rootDir>/src/PresentationalComponents',
    '^PresentationalComponents/(.*)':
      '<rootDir>/src/PresentationalComponents/$1',
    '^Mutations(|/.*)': '<rootDir>/src/Mutations$1',
    '^Utilities/(.*)': '<rootDir>/src/Utilities/$1',
    '^Store/(.*)': '<rootDir>/src/store/$1',
    '^Store$': '<rootDir>/src/store',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
