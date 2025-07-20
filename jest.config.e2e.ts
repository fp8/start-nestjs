import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testMatch: ["**/test-e2e/*.e2e.ts", "**/test-e2e/**/*.e2e.ts"],
    "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  verbose: true,
};

export default config;
