/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for static export
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable server-side features for static hosting
  trailingSlash: true,
};

module.exports = nextConfig;
