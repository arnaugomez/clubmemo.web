/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // If you're planning to use oslo/password for hashing passwords, mark its dependencies as external to prevent it from getting bundled.
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
};

export default nextConfig;
