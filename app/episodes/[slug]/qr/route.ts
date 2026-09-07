import QRCode from 'qrcode';
import { getAllEpisodes, resolveEpisode, vanityUrl } from '@/lib/episodes';

/**
 * QR code d'un épisode, en SVG — `/episodes/[slug]/qr`.
 * La version imprimable est servie par `/episodes/[slug]/qr.png`.
 *
 * Règle absolue : le code encode **toujours** l'URL de la marque
 * (`derriere-la-marque.com/[slug]`), jamais une URL Spotify, YouTube ou Apple.
 * Un flyer, un kakémono ou une plaque posée à l'accueil du client restent donc
 * valides même si toute la diffusion change de main.
 *
 * Niveau de correction M (~15 % de tolérance) : le bon compromis pour un code
 * imprimé sur un support qui peut être plié ou sali. Fond transparent, tracé en
 * `currentColor` noir — le QR s'intègre à la page sans cadre blanc.
 */

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const episodes = await getAllEpisodes();
  return episodes.map((episode) => ({ slug: episode.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episode = await resolveEpisode(slug);
  if (!episode) return new Response('Épisode inconnu.', { status: 404 });

  const svg = await QRCode.toString(vanityUrl(episode), {
    errorCorrectionLevel: 'M',
    margin: 1,
    type: 'svg',
    color: { dark: '#000000', light: '#00000000' },
  });

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
