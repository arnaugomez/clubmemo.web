# Folder structure

- `.vscode` - Visual Studio Code IDE settings.
- `.github` - Github settings and CI/CD workflows.
- `docs` - Contains the documentation files.
- `app` - Next.js framework app router files, contains information about routes for pages and API endpoints.
- `src` - Contains the source code of the project.
  - `common` - Entities that are shared across the project.
  - `[domain]` - Following the DDD approach, the `src` directory contains a subdirectory for each domain of the project: `auth`, `user`, `product`, etc.
    - `domain` - Domain layer, contains the business logic and models
    - `data` - Data layer, contains the data access logic and services
    - `ui` - View layer, contains the view logic and UI components
- `public` - Contains the public files and static assets of the project.
- `scripts` - Scripts to automate tasks locally and to run in a CI/CD environment
- `test` - Files with tests and testing utilities.
- `e2e` - End-to-end tests and testing utilities.