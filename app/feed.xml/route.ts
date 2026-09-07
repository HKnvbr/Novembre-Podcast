import { site } from '@/content/site';
import type { Episode } from '@/content/types';
import { canonicalUrl, getAllEpisodes } from '@/lib/episodes';
import { formatClock } from '@/lib/format';

/**
 * Flux RSS podcast — `derriere-la-marque.com/feed.xml`.
 *
 * Le site est la source éditoriale ; les plateformes consomment ce flux. On
 * s'arrête volontairement là : l'hébergement des fichiers audio, la mesure
 * d'écoute et l'insertion dynamique restent le métier d'un hébergeur spécialisé
 * (Acast, Ausha, Podcastics…). Il suffit alors de faire pointer `audioUrl` vers
 * son CDN — le reste du flux ne change pas.
 *
 * `<link>` de chaque item pointe sur la page du podcast, jamais sur la
 * plateforme : même dans les applications d'écoute, l'adresse de référence
 * reste la nôtre.
 */

export const dynamic = 'force-static';

const ITUNES = 'http://www.itunes.com/dtds/podcast-1.0.dtd';
const CONTENT = 'http://purl.org/rss/1.0/modules/content/';
const PODCAST = 'https://podcastindex.org/namespace/1.0';

function esc(valeur: string): string {
  return valeur
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function cdata(valeur: string): string {
  return `<![CDATA[${valeur.replace(/]]>/g, ']]&gt;')}]]>`;
}

function mime(url: string): string {
  if (url.endsWith('.wav')) return 'audio/wav';
  if (url.endsWith('.m4a')) return 'audio/mp4';
  return 'audio/mpeg';
}

function item(episode: Episode): string {
  const url = canonicalUrl(episode);
  const audio = episode.audioUrl ? `${site.url}${episode.audioUrl}` : null;
  const image = `${site.url}${episode.coverImage.src}`;

  const resume = [
    episode.excerpt,
    '',
    ...episode.description,
    '',
    'Les liens de l’épisode :',
    ...episode.resources.map((r) => `· ${r.title} — ${r.url}`),
    '',
    `Page de l’épisode : ${url}`,
  ].join('\n');

  return `    <item>
      <title>${esc(`Épisode ${episode.episodeNumber} — ${episode.guest.name}, ${episode.guest.company}`)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${new Date(episode.publishedAt).toUTCString()}</pubDate>
      <description>${cdata(episode.excerpt)}</description>
      <content:encoded>${cdata(resume)}</content:encoded>
      <itunes:title>${esc(episode.title)}</itunes:title>
      <itunes:episode>${episode.episodeNumber}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:author>${esc(site.host.name)}</itunes:author>
      <itunes:subtitle>${esc(`${episode.guest.name} — ${episode.guest.role}, ${episode.guest.company}`)}</itunes:subtitle>
      <itunes:summary>${cdata(episode.excerpt)}</itunes:summary>
      <itunes:duration>${formatClock(episode.duration)}</itunes:duration>
      <itunes:explicit>false</itunes:explicit>
      <itunes:image href="${esc(image)}" />
${audio ? `      <enclosure url="${esc(audio)}" type="${mime(episode.audioUrl as string)}" length="${episode.audioBytes ?? 0}" />\n` : ''}    </item>`;
}

export async function GET() {
  const episodes = await getAllEpisodes();
  const image = `${site.url}/episodes/micro-noir.jpg`;

  const flux = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="${ITUNES}" xmlns:content="${CONTENT}" xmlns:podcast="${PODCAST}" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)}</title>
    <link>${esc(site.url)}</link>
    <atom:link href="${esc(`${site.url}/feed.xml`)}" rel="self" type="application/rss+xml" />
    <language>fr-fr</language>
    <copyright>© ${new Date().getFullYear()} ${site.name}</copyright>
    <description>${cdata(`${site.tagline} ${site.intro}`)}</description>
    <lastBuildDate>${new Date(episodes[0]?.publishedAt ?? Date.now()).toUTCString()}</lastBuildDate>
    <generator>derriere-la-marque.com</generator>
    <itunes:author>${esc(site.host.name)}</itunes:author>
    <itunes:summary>${cdata(site.intro)}</itunes:summary>
    <itunes:subtitle>${esc(site.tagline)}</itunes:subtitle>
    <itunes:type>episodic</itunes:type>
    <itunes:explicit>false</itunes:explicit>
    <itunes:image href="${esc(image)}" />
    <itunes:category text="Business">
      <itunes:category text="Entrepreneurship" />
    </itunes:category>
    <itunes:category text="Arts">
      <itunes:category text="Design" />
    </itunes:category>
    <itunes:owner>
      <itunes:name>${esc(site.name)}</itunes:name>
      <itunes:email>${esc(site.email)}</itunes:email>
    </itunes:owner>
    <image>
      <url>${esc(image)}</url>
      <title>${esc(site.name)}</title>
      <link>${esc(site.url)}</link>
    </image>
${episodes.map(item).join('\n')}
  </channel>
</rss>
`;

  return new Response(flux, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, stale-while-revalidate=86400',
    },
  });
}
