# Sample NestJS Project

This is a sample NestJS project with basic configuration for Farport Software.

It uses 2 basic packages for all Farport projects:

* [jlog-facade](https://github.com/fp8/jlog-facade)
* [@fp8/simple-config](https://github.com/fp8/simple-config/)

## Objective

1. A quick way to scaffold a Typescript project with test
1. Propose a structure with directory such as `core` and `dto`
1. Make sure to leverage type safety provided by Typescript with strict config (see `tsconfig.json`)
1. Ensure that typescript code is clear of error and formatted correctly (via `yarn lint`)

## Usage

Assuming that you are creating a new `start-proj` project, do the following:

```bash
mkdir start-proj
cd start-proj
curl -L https://github.com/fp8/start-nestjs/archive/refs/tags/0.1.0.tar.gz | tar -xv --strip=1
```

The structure of the project should be usable as is.  The use of `start.ts` encapsulate all the complexity
related to project startup.

Some changes needed:

1. Ensure that `etc/local/app.yaml` and `dto/config.dto` contains configuration
1. Update `LOGGER_NAME` in the `src/core/logger.ts` to desired name
1. Add the actual helpers 

Make sure to update your `package.json` with:

1. Update the `.name` to your project name
1. Ensure that `.license` is updated to your desired license

## @proj Alias

The alias `@proj` is created to point to `./src` directory.  This allow you to avoid use of relative reference
in your code.  Use of `@proj` is specially import in tests as `test:dist` task will switch to use `./dist` so
the compiled version of code is tested.  This is done at the end of the `build` task.

The reference to `@proj` is removed in the `./dist` via the `build:alias` task. 

# Run the sample project

To run this sample app, simple do:

```bash
yarn start
```

By detail, as no `FP8_ENV` environment variable is not used, the config under `etc/local` is used.  To try with another config, try:

```bash
FP8_ENV=utest yarn start
```

# Running Tests

When creating a test, make sure to follow the path defined in `src` and try your best to mirror the project structure under `test`.  If you have a `src/core/helpers.ts`, it is therefore expected to have a corresponding test under `test/core/helpers.spec.ts`.

The test in the project must focus sorely on unit testing.  The end-to-end testing is expected to be written in a separate project using [Playwright](https://playwright.dev/).

## Running Tests

By default, the test is run in parellel to speed up the testing and show all failures in the end.  To run test during dev, you would simple run:

```bash
yarn test
```

To run a single test suite, do:

```bash
yarn test helpers.spec.ts
```

To run test with coverage, do:

```bash
yarn test --coverage
```

## Running Tests in Debug

When number of test increases, it can be difficult to see where the failure happens.  You can run:

```bash
yarn test:debug
```

In this case, the test will be run in sequence and it will stop upon first failure.  You can further filter this to a single test suit:

```bash
yarn test:debug helpers.spec.ts
```

## Test Configuration

A unit test config is created under `etc/utest` as all test are configured to use `FP8_ENV=utest` (see `package.json`).  It is expected that unit test are created for the entire project and achieving at least 90% of coverage.  In case there is a line that you wish to skip from the coverage as it doesn't make sense to test it, you can skip that line from coverage by prefix the line in question with:

```typesscript
// istanbul ignore next @preserve
```
