import { withSentryConfig } from "@sentry/nextjs";
const { AWS_BUCKET_NAME, AWS_REGION } = process.env;

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // If you're planning to use oslo/password for hashing passwords, mark its dependencies as external to prevent it from getting bundled.
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");

    // Necessary for pdfjs-dist library to work in Next.js
    // config.resolve.alias.canvas = false;
    // config.resolve.alias.encoding = false;
    // config.experiments.topLevelAwait = true;
    // config.experiments = { ...config.experiments, topLevelAwait: true };

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

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "arnau-gomez",
  project: "clubmemo",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
