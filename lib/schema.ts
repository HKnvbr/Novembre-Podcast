import { site } from '@/content/site';
import type { Episode } from '@/content/types';
import { canonicalUrl } from './episodes';
import { formatIsoDuration } from './format';

/**
 * Données structurées Schema.org.
 *
 * Le podcast est décrit comme une `PodcastSeries` portée par son propre nom —
 * le média est autonome, il ne dépend d'aucune marque tierce. Chaque épisode
 * est un `PodcastEpisode` avec son `AudioObject`, son `VideoObject`, son
 * invité et son animateur.
 */

const SERIES_ID = `${site.url}/#podcast`;
const EDITEUR_ID = `${site.url}/#editeur`;
const HOTE_ID = `${site.url}/#animateur`;

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': EDITEUR_ID,
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.intro,
  };
}

export function hostSchema() {
  return {
    '@type': 'Person',
    '@id': HOTE_ID,
    name: site.host.name,
    jobTitle: site.host.role,
    description: site.host.bio,
  };
}

export function seriesSchema() {
  return {
    '@type': 'PodcastSeries',
    '@id': SERIES_ID,
    name: site.name,
    alternateName: `${site.name} — ${site.descriptor}`,
    url: site.url,
    description: site.intro,
    inLanguage: 'fr-FR',
    webFeed: `${site.url}/feed.xml`,
    author: { '@id': HOTE_ID },
    publisher: { '@id': EDITEUR_ID },
  };
}

export function episodeSchema(episode: Episode) {
  const url = canonicalUrl(episode);
  const image = `${site.url}${episode.coverImage.src}`;

  return {
    '@type': 'PodcastEpisode',
    '@id': `${url}#episode`,
    url,
    name: episode.title,
    episodeNumber: episode.episodeNumber,
    description: episode.excerpt,
    datePublished: episode.publishedAt,
    timeRequired: formatIsoDuration(episode.duration),
    inLanguage: 'fr-FR',
    image,
    thumbnailUrl: image,
    keywords: episode.topics.join(', '),
    partOfSeries: { '@id': SERIES_ID },
    publisher: { '@id': EDITEUR_ID },
    /** L'animateur est le même sur toute la série. */
    actor: { '@id': HOTE_ID },
    ...(episode.recordedAt
      ? { locationCreated: { '@type': 'Place', name: episode.recordedAt } }
      : {}),
    ...(episode.audioUrl
      ? {
          associatedMedia: {
            '@type': 'AudioObject',
            contentUrl: `${site.url}${episode.audioUrl}`,
            duration: formatIsoDuration(episode.duration),
            encodingFormat: episode.audioUrl.endsWith('.wav') ? 'audio/wav' : 'audio/mpeg',
          },
        }
      : {}),
    ...(episode.youtubeId
      ? {
          video: {
            '@type': 'VideoObject',
            name: episode.title,
            description: episode.excerpt,
            thumbnailUrl: image,
            uploadDate: new Date(episode.publishedAt).toISOString(),
            embedUrl: `https://www.youtube-nocookie.com/embed/${episode.youtubeId}`,
            duration: formatIsoDuration(episode.duration),
          },
        }
      : {}),
    about: {
      '@type': 'Person',
      name: episode.guest.name,
      jobTitle: episode.guest.role,
      description: episode.guest.bio,
      ...(episode.guest.linkedin ? { sameAs: [episode.guest.linkedin] } : {}),
      worksFor: {
        '@type': 'Organization',
        name: episode.guest.company,
        ...(episode.clientUrl ? { url: episode.clientUrl } : {}),
      },
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

/** Emballe un ou plusieurs nœuds dans un graphe JSON-LD unique. */
export function jsonLdGraph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
