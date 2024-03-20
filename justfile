default:
    just --list

# Install dependencies
install *deps:
    ./nvm-exec.sh pnpm install {{ deps }}

# Run the development server
dev:
    ./nvm-exec.sh pnpm run dev

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
    just install
    just install-git-hooks

test:
    ./nvm-exec.sh pnpm test

alias i := install
