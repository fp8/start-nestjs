import config from './jest.config';

config.moduleNameMapper = {
  '^@proj$': '<rootDir>/dist',
  '^@proj/(.*)$': '<rootDir>/dist/$1',
};

config.transform = {
  "^.+\\.(t|j)s$": [
    "ts-jest",
    {
      "ts-jest": {
        tsconfig: "./tsconfig.testlib.json",
      },
    },
  ],
};

config.transformIgnorePatterns = [
  "<rootDir>/dist/.*\\.js$"
];

export default config;