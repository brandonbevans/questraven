/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    // Tells Next/Turbopack to treat these as external modules and NOT attempt
    // to bundle them.  This often fixes issues with certain node libraries
    // or server-only libraries that rely on dynamic imports.
    serverComponentsExternalPackages: ['llamaindex']
  }
};

module.exports = nextConfig;
