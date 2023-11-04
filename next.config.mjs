/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  env: {
    // @ts-ignore
    SUPABASE_KEY: process.env.SUPABASE_KEY,
  },
};

export default config;
