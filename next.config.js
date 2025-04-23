/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use export for production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    distDir: 'out',
  }),
  // Configure for GitHub Pages - replace 'reportcard-portal' with your repository name
  basePath: process.env.NODE_ENV === 'production' ? '/reportcard-portal' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/reportcard-portal/' : '',
  images: {
    unoptimized: true,
  },
  // Disable server-side features since GitHub Pages is static
  trailingSlash: true,
};

module.exports = nextConfig;
