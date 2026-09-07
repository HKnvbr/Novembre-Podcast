import type { Metadata } from 'next';
import { site } from '@/content/site';
import type { Episode } from '@/content/types';
import { canonicalUrl, episodeName, guestLine } from './episodes';
import { formatEpisodeNumber } from './format';

/**
 * Construction des métadonnées. Un seul principe : l'URL canonique d'un
 * épisode est toujours `derriere-la-marque.com/episodes/[slug]`, quelle que soit
 * l'adresse par laquelle le visiteur est arrivé.
 */

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${site.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — ${site.name}`,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${site.name}`,
      description,
    },
  };
}

export function episodeMetadata(episode: Episode): Metadata {
  const url = canonicalUrl(episode);
  const number = formatEpisodeNumber(episode.episodeNumber);

  // Le titre de partage porte le client, comme les pochettes du fichier de
  // charte — c'est le nom qu'on reconnaît dans un fil. Le gabarit de
  // `layout.tsx` y ajoute déjà le nom du média, on ne le répète pas ici.
  // La formule de la charte fait le titre de partage : « Derrière Café Reck, il
  // y a Thomas Riegert ». Le gabarit du layout y ajoute le nom du média.
  const title = episode.seo?.title ?? episodeName(episode);
  const description =
    episode.seo?.description ?? `Épisode ${number} · ${guestLine(episode)} · ${episode.excerpt}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [...episode.topics, episode.guest.company, 'podcast', 'marque', site.name],
    authors: [{ name: site.host.name }],
    openGraph: {
      type: 'article',
      title: `${title} — ${site.name}`,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      publishedTime: new Date(episode.publishedAt).toISOString(),
      authors: [site.host.name],
      // Sans `seo.image`, Next utilise `opengraph-image.tsx` de la route :
      // une carte de partage générée à la volée, typographiée dans la police de la marque.
      ...(episode.seo?.image
        ? { images: [{ url: episode.seo.image, width: 1200, height: 630, alt: title }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${site.name}`,
      description,
      ...(episode.seo?.image ? { images: [episode.seo.image] } : {}),
    },
  };
}
