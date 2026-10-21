import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Page d'attente (lib/coming-soon.ts) : la valeur est gravée au build, dans les
  // pages comme dans `proxy.ts`. Sans cela, le proxy la relisait au démarrage,
  // et un réglage oublié à l'une des deux étapes ouvrait le site à moitié.
  env: { PAGE_ATTENTE: process.env.PAGE_ATTENTE ?? '' },
  images: {
    // Toute la photographie du prototype est locale (public/episodes).
    // Pour brancher un CMS headless, déclarer ici son domaine d'assets :
    // remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
