default:
  just --list

# Install dependencies
install *deps:
    ./nvm-exec.sh pnpm i {{deps}}

# Run the development server
dev:
    ./nvm-exec.sh pnpm run dev

# Apply automatic fixes
fix:
    ./nvm-exec.sh pnpm format
    ./nvm-exec.sh pnpm fix

# Add a new shadcn-ui component
add-component component:
    ./nvm-exec.sh pnpm dlx shadcn-ui@latest add {{component}}

# Aliases
alias i := install
