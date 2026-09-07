import { episodes as source } from '@/content/episodes';
import { site } from '@/content/site';
import type { Episode, PlatformKey } from '@/content/types';

/**
 * Couche d'accès aux données — le seul point de contact entre les pages et le
 * contenu.
 *
 * Toutes les fonctions sont asynchrones, y compris celles qui n'en ont pas
 * besoin aujourd'hui. C'est délibéré : brancher un CMS headless (Sanity,
 * Payload, Strapi, Contentful) revient à remplacer le corps de ce fichier par
 * des requêtes réseau, sans toucher une seule page.
 */

function isPublished(episode: Episode): boolean {
  return episode.published !== false;
}

/** Du plus récent au plus ancien. */
function byDateDesc(a: Episode, b: Episode): number {
  const delta = Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
  return delta !== 0 ? delta : b.episodeNumber - a.episodeNumber;
}

export async function getAllEpisodes(): Promise<Episode[]> {
  return source.filter(isPublished).slice().sort(byDateDesc);
}

export async function getLatestEpisode(): Promise<Episode | null> {
  const all = await getAllEpisodes();
  return all[0] ?? null;
}

export async function getEpisode(slug: string): Promise<Episode | null> {
  const all = await getAllEpisodes();
  return all.find((episode) => episode.slug === slug) ?? null;
}

/**
 * Résout un slug canonique **ou** un alias vers l'épisode correspondant.
 * C'est ce qui permet à `/verrier` de continuer à fonctionner indéfiniment
 * même si le slug canonique change.
 */
export async function resolveEpisode(slug: string): Promise<Episode | null> {
  const needle = slug.toLowerCase();
  const all = await getAllEpisodes();
  return (
    all.find(
      (episode) =>
        episode.slug === needle || episode.aliases?.some((alias) => alias.toLowerCase() === needle),
    ) ?? null
  );
}

/** Épisode précédent / suivant dans l'ordre éditorial (chronologique croissant). */
export async function getNeighbours(
  slug: string,
): Promise<{ previous: Episode | null; next: Episode | null }> {
  const chronological = (await getAllEpisodes()).slice().reverse();
  const index = chronological.findIndex((episode) => episode.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: chronological[index - 1] ?? null,
    next: chronological[index + 1] ?? null,
  };
}

/** Toutes les rubriques utilisées, pour les filtres de l'archive. */
export async function getTopics(): Promise<string[]> {
  const all = await getAllEpisodes();
  return [...new Set(all.flatMap((episode) => episode.topics))].sort((a, b) =>
    a.localeCompare(b, 'fr'),
  );
}

/* --------------------------------------------------------------------------
 * URLs — le média reste propriétaire de ses adresses
 * ------------------------------------------------------------------------ */

/* --------------------------------------------------------------------------
 * Libellés — la convention du fichier de charte
 * ------------------------------------------------------------------------ */

/**
 * Identité d'un épisode telle que la charte la compose sur les pochettes et
 * les cartes de partage : le nom du média, puis le client.
 *
 *   « Derrière la marque / Café Reck »
 *
 * Elle sert là où le contexte ne dit pas déjà de quel média il s'agit — carte
 * de partage, pochette, publication. Sur le site, l'en-tête porte déjà le
 * logotype : la répéter dans chaque hero serait redondant.
 */
export function episodeIdentity(episode: Pick<Episode, 'guest'>): string {
  return `Derrière la marque / ${episode.guest.company}`;
}

/**
 * Présentation de l'invité, dans la tournure de la charte :
 *
 *   « Il y a Thomas Riegert, artisan torréfacteur »
 *
 * C'est la voix éditoriale du podcast — on ne dit pas « avec », on dit « il y a ».
 */
export function guestLine(episode: Pick<Episode, 'guest'>): string {
  return `Il y a ${episode.guest.name}, ${lowerFirst(episode.guest.role)}`;
}

/** « Directrice de la marque » → « directrice de la marque ». Les fonctions
 *  sont saisies capitalisées dans les données ; dans une phrase, elles ne le
 *  sont pas. Les sigles et les noms propres restent intacts. */
function lowerFirst(valeur: string): string {
  if (valeur.length < 2) return valeur;
  // Un deuxième caractère en capitale signale un sigle (« CEO », « DG ») ou un
  // nom propre : on n'y touche pas.
  if (valeur[1] === valeur[1]?.toUpperCase() && /[A-ZÀ-Ý]/.test(valeur[1] ?? '')) return valeur;
  return valeur[0]!.toLowerCase() + valeur.slice(1);
}

/** URL canonique et permanente d'un épisode. */
export function episodeUrl(episode: Pick<Episode, 'slug'>): string {
  return `/episodes/${episode.slug}`;
}

/** URL courte de communication : `derriere-la-marque.com/[slug]`.
 *  C'est celle qu'on imprime, qu'on partage et qu'on encode en QR code. */
export function vanityUrl(episode: Pick<Episode, 'slug'>): string {
  return `${site.url}/${episode.slug}`;
}

export function canonicalUrl(episode: Pick<Episode, 'slug'>): string {
  return `${site.url}${episodeUrl(episode)}`;
}

/** URL courte vers une plateforme : `derriere-la-marque.com/[slug]/spotify`. */
export function platformShortUrl(episode: Pick<Episode, 'slug'>, platform: string): string {
  return `${site.url}/${episode.slug}/${platform}`;
}

/**
 * Alias acceptés par la redirection courte. Ils absorbent les variantes qu'on
 * écrit naturellement à l'oral ou dans un mail — l'URL publique reste stable,
 * la destination est modifiable dans les données.
 */
const PLATFORM_ALIASES: Record<string, PlatformKey> = {
  spotify: 'spotify',
  apple: 'apple',
  'apple-podcasts': 'apple',
  itunes: 'apple',
  youtube: 'youtube',
  yt: 'youtube',
  video: 'youtube',
  deezer: 'deezer',
  amazon: 'amazon',
  'amazon-music': 'amazon',
  castbox: 'castbox',
  rss: 'rss',
  feed: 'rss',
};

/** Destinations non-plateforme également exposées en URL courte. */
export type SpecialTarget = 'site' | 'linkedin' | 'ecouter';

export function normalizePlatform(input: string): PlatformKey | SpecialTarget | null {
  const key = input.toLowerCase();
  if (PLATFORM_ALIASES[key]) return PLATFORM_ALIASES[key];
  if (key === 'site' || key === 'client') return 'site';
  if (key === 'linkedin' || key === 'invite' || key === 'invité') return 'linkedin';
  if (key === 'ecouter' || key === 'écouter' || key === 'listen') return 'ecouter';
  return null;
}

/** Résout une cible de redirection courte vers son URL de destination. */
export function resolveTarget(episode: Episode, target: PlatformKey | SpecialTarget): string | null {
  switch (target) {
    case 'site':
      return episode.clientUrl ?? episode.guest.website ?? null;
    case 'linkedin':
      return episode.guest.linkedin ?? null;
    case 'ecouter':
      return canonicalUrl(episode);
    case 'rss':
      return episode.platforms.rss ?? `${site.url}/feed.xml`;
    default:
      return episode.platforms[target] ?? null;
  }
}
