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
 * Le verrou graphique de la charte : le nom du client devient la troisième ligne
 * du logotype.
 *
 *   DERᴙIÈRE
 *   LA MARQUE
 *   RECK
 *
 * C'est ce que montrent la carte d'épisode et la pochette du fichier — le média
 * ne se juxtapose pas au client, il l'absorbe. Sert aux pochettes, aux cartes de
 * partage et aux publications. Sur le site, l'en-tête porte déjà le logotype :
 * le répéter dans chaque hero serait redondant.
 */
export function episodeIdentity(episode: Pick<Episode, 'guest'>): string {
  return `Derrière la marque ${episode.guest.company}`;
}

/**
 * Le titre de l'épisode tel qu'il part sur les plateformes :
 *
 *   « Derrière Café Reck, il y a Thomas Riegert »
 *
 * Relevé tel quel sur la planche Apple Podcasts du fichier de charte, où le
 * gabarit est écrit en clair : « DERRIÈRE LA MARQUE XX, il y a XXXX ». Le nom du
 * média est un début de phrase que chaque épisode termine — c'est le ressort
 * éditorial, et il ne se laisse pas remplacer par un titre libre.
 *
 * Le site garde en plus le titre rédactionnel (`episode.title`) pour son grand
 * titre : c'est ce que la charte affiche sur la carte, sous le nom de l'épisode.
 * Cette formule-là sert partout où le contexte ne dit pas déjà de quel média il
 * s'agit — flux RSS, carte de partage, référencement, données structurées.
 */
export function episodeName(episode: Pick<Episode, 'guest'>): string {
  return `Derrière ${episode.guest.company}, il y a ${episode.guest.name}`;
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

/**
 * L'autre tournure de la charte, celle des cartes : « Avec Thomas Riegert,
 * artisan torréfacteur ». Les deux coexistent dans le fichier et ne disent pas la
 * même chose — « il y a » est la voix du titre, qui révèle quelqu'un derrière une
 * marque ; « Avec » est le crédit, qui l'attribue.
 */
export function guestCredit(episode: Pick<Episode, 'guest'>): string {
  return `Avec ${episode.guest.name}, ${lowerFirst(episode.guest.role)}`;
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
