/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // If you're planning to use oslo/password for hashing passwords, mark its dependencies as external to prevent it from getting bundled.
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    // Necessary for pdfjs-dist library to work in Next.js
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "clubmemo-staging.s3.eu-south-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "clubmemo-production.s3.eu-south-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
