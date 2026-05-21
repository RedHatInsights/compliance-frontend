const compliancePlatform = process.env.IOP === 'true' ? 'iop' : 'hcc';

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
    'node_modules/(?!(uuid|p-all|p-map|aggregate-error|indent-string|clean-stack|bastilian-tabletools))',
  ],
  moduleNameMapper: {
    '^@/PresentationalComponents/ComplianceLinks/complianceLink$': `<rootDir>/src/PresentationalComponents/ComplianceLinks/complianceLink.${compliancePlatform}.js`,
    '^@/routing/compliancePaths$': `<rootDir>/src/routing/compliancePaths.${compliancePlatform}.js`,
    '^@/routing/complianceRoutePrefixes$': `<rootDir>/src/routing/complianceRoutePrefixes.${compliancePlatform}.js`,
    '^@/Utilities/hooks/useComplianceNavigate$': `<rootDir>/src/Utilities/hooks/useComplianceNavigate/useComplianceNavigate.${compliancePlatform}.js`,
    '^@/platform/chrome/useComplianceChrome$': `<rootDir>/src/platform/chrome/useComplianceChrome.${compliancePlatform}.js`,
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
