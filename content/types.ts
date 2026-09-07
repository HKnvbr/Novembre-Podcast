/**
 * Modèle de données éditorial du podcast.
 *
 * Ce fichier est la source de vérité *typée* : les données vivent aujourd'hui
 * dans `content/episodes.ts` (fichiers locaux) et sont lues exclusivement via
 * `lib/episodes.ts`. Pour migrer vers un CMS headless (Sanity, Payload, Strapi,
 * Contentful), on ne réécrit que `lib/episodes.ts` — ces types et toutes les
 * pages restent inchangés.
 */

/** Plateformes de diffusion. Sert aussi de clé pour les redirections courtes
 *  `derriere-la-marque.com/[slug]/[plateforme]`. */
export type PlatformKey =
  | 'spotify'
  | 'apple'
  | 'youtube'
  | 'deezer'
  | 'amazon'
  | 'castbox'
  | 'rss';

export type ResourceCategory =
  | 'Étude'
  | 'Article'
  | 'Design'
  | 'Innovation'
  | 'Marque'
  | 'Produit'
  | 'Livre'
  | 'Entreprise'
  | 'Référence'
  | 'Réseau social'
  | 'Coulisses';

/** Une ressource citée pendant l'épisode — la brique éditoriale des « liens de l'épisode ». */
export interface Resource {
  title: string;
  url: string;
  category: ResourceCategory;
  /** Nom de la source affiché sous le titre (média, studio, entreprise…). */
  source?: string;
  description?: string;
  image?: string;
}

export interface Guest {
  name: string;
  role: string;
  company: string;
  bio: string;
  linkedin?: string;
  website?: string;
  /** Portrait cadré 4/5. */
  portrait?: Image;
}

export interface Image {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Seo {
  title?: string;
  description?: string;
  image?: string;
}

export interface Episode {
  id: string;
  /** Segment d'URL canonique — et URL courte de la marque : `/[slug]`. */
  slug: string;
  /** Anciens slugs ou raccourcis commerciaux qui doivent continuer à résoudre. */
  aliases?: string[];
  episodeNumber: number;
  title: string;
  /** Accroche courte (listes, cartes, partages). */
  excerpt: string;
  /** Texte éditorial de la page épisode. Un paragraphe par entrée. */
  description: string[];
  /** ISO 8601. */
  publishedAt: string;
  /** Durée en secondes. */
  duration: number;
  /** Ville / lieu d'enregistrement — « pas depuis un studio, chez eux ». */
  recordedAt?: string;
  /** Rubriques éditoriales. */
  topics: string[];

  guest: Guest;

  coverImage: Image;
  /** Visuel de contexte : l'environnement du client. */
  environmentImage?: Image;
  /** Vidéo de fond du hero (muette, en boucle). Optionnelle. */
  heroVideo?: string;

  audioUrl?: string;
  /** Taille du fichier audio en octets — requise par `<enclosure>` dans le flux
   *  RSS. Fournie par l'hébergeur audio en production. */
  audioBytes?: number;
  /** Identifiant YouTube (pas l'URL complète) : permet l'embed et la façade. */
  youtubeId?: string;
  /** Destinations des redirections courtes. Modifiables sans changer l'URL publique. */
  platforms: Partial<Record<PlatformKey, string>>;
  /** Site du client — exposé sur `/[slug]/site`. */
  clientUrl?: string;

  resources: Resource[];

  seo?: Seo;
  /** `false` masque l'épisode des listes et du flux RSS (brouillon). */
  published?: boolean;
}
