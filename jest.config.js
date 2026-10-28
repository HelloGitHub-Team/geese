// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],

  testEnvironment: 'jest-environment-jsdom',

  /**
   * Absolute imports and Module Path Aliases
   */
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/public/$1',
    // Jest 27 does not resolve this dependency's conditional subpath export.
    '^unist-util-visit-parents/do-not-use-color$':
      '<rootDir>/node_modules/unist-util-visit-parents/lib/color.js',
    '^#(minpath|minproc|minurl)$':
      '<rootDir>/node_modules/vfile/lib/$1.browser.js',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = async () => {
  const config = await createJestConfig(customJestConfig)();
  // Markdown's ESM dependency tree needs the same SWC transform as our code.
  config.transformIgnorePatterns = [
    '/node_modules/(?!(react-markdown|remark-[^/]+|rehype-[^/]+|unified|bail|devlop|is-plain-obj|trough|vfile[^/]*|unist-[^/]+|mdast-[^/]+|hast-[^/]+|estree-[^/]+|micromark[^/]*|decode-named-character-reference|character-entities[^/]*|property-information|space-separated-tokens|comma-separated-tokens|ccount|escape-string-regexp|trim-lines|zwitch|html-url-attributes|markdown-table|longest-streak)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ];
  return config;
};
