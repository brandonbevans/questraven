/** @type {import('next').NextConfig} */

const nextConfig = {
  // Tells Next/Turbopack to treat these as external modules and NOT attempt
  // to bundle them.  This often fixes issues with certain node libraries
  // or server-only libraries that rely on dynamic imports.
  serverExternalPackages: ['llamaindex'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark onnxruntime-node as external
      config.externals.push('onnxruntime-node');
    }
    return config;
  }
};

module.exports = nextConfig;
