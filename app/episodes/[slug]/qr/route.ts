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
 * imprimé sur un support qui peut être plié ou sali.
 *
 * Fond transparent, modules en bleu nuit : le code se pose sur le crème de la
 * page sans cadre blanc, et le couple reste à 12,7:1 — très au-delà de ce qu'un
 * lecteur demande. La version imprimable, elle, reste en noir sur blanc : un
 * support commercial passe par des photocopieurs et des impressions monochromes
 * dont on ne maîtrise rien.
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
    color: { dark: '#1a243d', light: '#00000000' },
  });

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
