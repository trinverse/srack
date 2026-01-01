import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Set base path for GitHub Pages (repository name)
  // Change 'srack' to your repository name if different
  basePath: process.env.NODE_ENV === 'production' ? '/srack' : '',

  // Trailing slashes for static hosting compatibility
  trailingSlash: true,
};

export default nextConfig;
