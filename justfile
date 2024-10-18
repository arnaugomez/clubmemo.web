default:
    just --list

# Install dependencies
install *deps:
    ./nvm-exec.sh pnpm install {{ deps }}

# Run the development server
dev:
    ./nvm-exec.sh pnpm run dev

# Compile and build the project
build:
    ./nvm-exec.sh pnpm run build

# Start production server
start:
    ./nvm-exec.sh pnpm run start

# Apply automatic fixes
fix:
    ./nvm-exec.sh pnpm format
    ./nvm-exec.sh pnpm fix

# Perform static code analysis
check:
    ./nvm-exec.sh pnpm check-format
    ./nvm-exec.sh pnpm check-types
    ./nvm-exec.sh pnpm lint

# Add a new shadcn-ui component
add-component component:
    ./nvm-exec.sh pnpm dlx shadcn-ui@latest add {{ component }}

# Install git hooks
install-git-hooks:
    lefthook install

# Set up the project for the first time
setup:
    ./nvm-exec.sh corepack enable
    just install
    just install-git-hooks

# Run unit tests
test:
    ./nvm-exec.sh pnpm test:unit

# Run end-to-end tests. For example: just e2e --ui
e2e *args:
    ./nvm-exec.sh pnpm exec playwright test {{ args }}

e2e-install:
    ./nvm-exec.sh pnpm exec playwright install

alias i := install
