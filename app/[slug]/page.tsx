import { permanentRedirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { episodes } from '@/content/episodes';
import { resolveEpisode } from '@/lib/episodes';

/**
 * URL courte de communication — `derriere-la-marque.com/[slug]`.
 *
 * C'est l'adresse qu'on imprime, qu'on encode en QR code et qu'on colle dans
 * une publication. Elle redirige en 308 vers la page canonique
 * `/episodes/[slug]` : une seule page indexée, une infinité d'adresses
 * d'entrée. Les anciens slugs déclarés dans `aliases` continuent de résoudre
 * indéfiniment — c'est tout l'intérêt de posséder ses URLs.
 */

export const dynamicParams = true;

export async function generateStaticParams() {
  return episodes.flatMap((episode) => [
    { slug: episode.slug },
    ...(episode.aliases ?? []).map((alias) => ({ slug: alias })),
  ]);
}

export default async function VanityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episode = await resolveEpisode(slug);
  if (!episode) notFound();
  permanentRedirect(`/episodes/${episode.slug}`);
}
