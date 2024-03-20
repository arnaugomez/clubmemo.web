# Git Branch Policy

## Naming conventions

### `main`

This branch contains the code in the production environment

### `dev`

Contains the code in the staging environment

### `feat/<branch-name>`

Introduces a new feature or improvement. The `<branch-name>` section should contain the task number/issue number and optionally a short description of the feature.

Examples:

- `feat/CM-123`
- `feat/CM-777-login-button-icon`

### `fix/<branch-name>`

Contains a bug fix

## Merging strategy

When the developer works on an issue, these steps should be followed:

1. Create a new branch from `dev` with the name `feat/<branch-name>` or `fix/<branch-name>`
2. Create a pull request to merge the branch into `dev`
3. After the code review and CI, the branch is merged into `dev`
4. In the sprint review, a demo is performed in the staging environment
5. If the changes are approved, the branch is merged into `main` and a deployment to production is performed.
