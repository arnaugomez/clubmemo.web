# Clubmemo

A web app for efficient study and memorization.

Upload your notes. Generate flashcards automatically with AI. Study efficiently with science-based techniques.

Created by [Arnau Gómez](https://www.arnaugomez.com) as part of his final project for the Computer Engineering degree at UNED.

## Usage of the app

If you're a student or just want to try out the app, you can access it by visiting this website: [www.clubmemo.com](https://www.clubmemo.com). Create your user, upload your notes, and start studying!

## Project setup for local development

If you're a developer and want to contribute to the project, you will need to run the web server in development mode in your local environment.

To set up the project in your local environment, follow the steps below:

First, make sure you have the following command line apps installed:

- `nvm` to manage node versions
- `just` as task runner (similar to Makefile but easier to use)
- `lefthook` as git hooks manager

Create the environment variable files:

```sh
touch .env.development.local # Development environment
touch .env.production.local # Production environment
touch .env.test.local # Test environment
```

You can learn about each environment variable and its purpose in the [environment variables documentation](src/common/types/env.d.ts). You can also ask the project author (Arnau Gómez) for the values, or use your own. However, they are not included in this code repository because they contain very sensitive information like passwords and API keys.

Once you have created the environment variable files, run these commands in the project root directory:

```sh
just setup # Install dependencies and set up the project
just dev # Start the development server
```

## Documentation and guides

- [Git Branch Policy](./docs/git-branch-policy.md)
- [Folder Structure](./docs/folder-structure.md)
- [Naming Conventions](./docs/naming-conventions.md)
