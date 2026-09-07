import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Toute la photographie du prototype est locale (public/episodes).
    // Pour brancher un CMS headless, déclarer ici son domaine d'assets :
    // remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
