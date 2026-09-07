import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { getAllEpisodes } from '@/lib/episodes';

/**
 * Les URLs courtes (`/[slug]`, `/[slug]/spotify`) sont volontairement absentes :
 * ce sont des redirections, pas des pages. Une seule adresse indexée par
 * épisode — la canonique.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const episodes = await getAllEpisodes();
  const dernier = episodes[0]?.publishedAt;

  return [
    { url: site.url, lastModified: dernier, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/episodes`, lastModified: dernier, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/a-propos`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${site.url}/participer`, changeFrequency: 'yearly', priority: 0.6 },
    ...episodes.map((episode) => ({
      url: `${site.url}/episodes/${episode.slug}`,
      lastModified: episode.publishedAt,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ];
}
