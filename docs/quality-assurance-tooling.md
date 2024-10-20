# Automated Quality Assurance Tooling

The project uses several tools to perform Quality Assurance checks. This section describes how to use them.

## Static code analysis

The project uses the following tools for static code analysis:

- Prettier for code formatting
- ESLint for JavaScript and TypeScript linting
- TSC for TypeScript type checking

To run the static code analysis tools, use the following commands:

```sh
just check # Runs Prettier, ESLint, and TSC
```

Tu run the static code analysis tools and automatically fix the issues, use the following command:

```sh
just fix
```

## Automated unit tests

The Vitest library provides an execution environment for unit and integration tests.

```sh
just test # Runs automated unit and integration tests
```

## Automated end-to-end tests

The project uses the Playwright library to perform end-to-end tests. These tests run the program on a real browser app and simulate user interactions.

```sh
just e2e-install # Install the Playwright dependencies
just e2e # Run the end-to-end tests
```

We recommend you run the Playwright tests in UI mode to see the browser window as the tests are running. This makes debugging easier.

```sh
just e2e --ui # Run the end-to-end tests in UI mode
```

## CI/CD pipeline

GitHub Actions is used to automate the CI/CD pipeline, which runs automated tests and static code analysis on a remote server before merging a pull request.

The CI/CD pipeline also runs locally thanks to git hooks managed by the Lefthook command-line utility. The git hooks are installed when the project is set up by running the `just setup` command.
