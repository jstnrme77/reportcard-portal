/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Configure for GitHub Pages - replace 'reportcard-portal' with your repository name
  basePath: process.env.NODE_ENV === 'production' ? '/reportcard-portal' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/reportcard-portal/' : '',
  images: {
    unoptimized: true,
  },
  // Disable server-side features since GitHub Pages is static
  trailingSlash: true,
  // Ensure the app is treated as a static site
  distDir: 'out',
};

module.exports = nextConfig;
