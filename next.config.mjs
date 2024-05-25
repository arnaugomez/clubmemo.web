const { AWS_BUCKET_NAME, AWS_REGION } = process.env;

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // If you're planning to use oslo/password for hashing passwords, mark its dependencies as external to prevent it from getting bundled.
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    // Necessary for pdfjs-dist library to work in Next.js
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    config.experiments.topLevelAwait = true;
    config.experiments = { ...config.experiments, topLevelAwait: true };
    // Do not bundle canvas package
    config.externals.push("canvas");

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com`,
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    outputFileTracingExcludes: {
      // Exclude canvas library in Vercel serverless functions. That way, the size of the serverless function remains below 50MB.
      "**/*": ["**canvas**"],
    },
  },
};

export default nextConfig;
