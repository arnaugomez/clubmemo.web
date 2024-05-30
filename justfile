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
    # just --unstable --fmt

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

# Run end-to-end tests
e2e *args:
    ./nvm-exec.sh pnpm exec playwright test {{ args }}


alias i := install
