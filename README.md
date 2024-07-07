# clubmemo

A web app for efficient study and memorization.

Upload your notes. Generate flashcards automatically with AI. Study efficiently with science-based techniques.

Created by [Arnau Gómez](https://www.arnaugomez.com) as part of his final project for the Computer Engineering degree at UNED.

## Project setup

To set up the project in your local environment, follow the steps below:

Make sure you have the following installed:

- `nvm` to manage node versions
- `just` as task runner (similar to Makefile but easier to use)
- `lefthook` as git hooks manager

Create the files with the environment variables:

```sh
touch .env.development.local # Development environment
touch .env.production.local # Production environment
touch .env.test.local # Test environment
```

Run these commands in the project root directory:

```sh
just setup # Set up the project
just dev # Start the development server
```

## Documentation and guides

- [Git Branch Policy](./docs/git-branch-policy.md)
- [Folder Structure](./docs/folder-structure.md)
- [Naming Conventions](./docs/naming-conventions.md)
