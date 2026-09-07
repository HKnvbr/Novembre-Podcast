import QRCode from 'qrcode';
import { getAllEpisodes, resolveEpisode, vanityUrl } from '@/lib/episodes';

/**
 * QR code imprimable — `/episodes/[slug]/qr.png`, 1200 px, noir sur blanc.
 * Servi en pièce jointe : un clic dans la page épisode suffit pour récupérer le
 * fichier à coller dans un support commercial.
 *
 * Même règle que la version SVG : le code encode l'URL de la marque, jamais une URL
 * de plateforme.
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

  const png = await QRCode.toBuffer(vanityUrl(episode), {
    errorCorrectionLevel: 'M',
    margin: 2,
    type: 'png',
    width: 1200,
    color: { dark: '#000000ff', light: '#ffffffff' },
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="derriere-la-marque-${episode.slug}-qr.png"`,
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
