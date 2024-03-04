default:
  just --list

# Install dependencies
install:
    ./nvm-exec.sh pnpm install

# Run the development server
dev:
    ./nvm-exec.sh pnpm run dev
# Add a new shadcn-ui component
add-component component:
    ./nvm-exec.sh pnpm dlx shadcn-ui@latest add {{component}}
