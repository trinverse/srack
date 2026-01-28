import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Note: Static export is disabled for full-stack features
  // For static GitHub Pages deployment, uncomment: output: 'export',

  images: {
    // Allow Supabase storage images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wwwkbbhvrmrjptxmalhp.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
