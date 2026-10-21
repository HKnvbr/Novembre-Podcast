import type { PlatformKey } from './types';

/**
 * Configuration éditoriale du site. Tout le wording de surface est ici :
 * c'est le fichier qu'on ouvre pour ajuster une promesse ou un intitulé.
 */

export const site = {
  /** Titre du média. Le logotype le dessine avec le R inversé (voir Wordmark). */
  name: 'Derrière la marque',
  /** Descripteur du logotype, en capitales espacées. Relevé sur le lockup du
   *  fichier de charte, où il forme la ligne sous « la marque ». */
  descriptor: 'Le podcast',
  /** Catégorie de diffusion, telle qu'elle apparaît sur la planche Apple
   *  Podcasts du fichier. Sert au flux RSS et aux données structurées. */
  category: 'Business',
  /** Sigle court, pour les contextes contraints. */
  initials: 'DLM',

  url: 'https://derriere-la-marque.fr',
  locale: 'fr_FR',
  lang: 'fr',
  /** L'adresse de la production, en deux morceaux. Écrite d'un bloc, elle
   *  partirait en clair dans le JavaScript envoyé au navigateur (l'en-tête,
   *  composant client, embarque tout `site`), où les robots qui collectent les
   *  adresses la trouvent. `adresseCourriel()` la reconstitue là où il la faut
   *  en clair ; `Courriel` l'assemble dans le navigateur. */
  courriel: { nom: 'production', domaine: 'derriere-la-marque.fr' },

  /** L'animateur du podcast — présent sur chaque épisode. */
  host: {
    name: 'Frédéric Cronenberger',
    role: 'Animateur',
    bio: 'Il reçoit celles et ceux qui décident, construisent et transforment les marques. Des conversations longues, sans script, enregistrées sur place.',
  },

  /**
   * Promesse retenue. Les alternatives travaillées sont conservées ci-dessous :
   * elles partagent le même ressort — ce qu'on ne voit pas depuis l'extérieur
   * d'une marque, et le fait d'aller le chercher là où il se trouve.
   */
  tagline: 'On va enregistrer là où la marque se fabrique.',
  taglineAlternatives: [
    'On va enregistrer là où la marque se fabrique.',
    'Derrière chaque marque, quelqu’un qui décide. On va lui parler.',
    'Ce qu’une marque ne met pas dans sa communication.',
    'Pas de studio. On vient chez vous, et on allume le micro.',
    'Une heure derrière la façade.',
    'Le micro se déplace. Les décisions se racontent sur place.',
  ],

  /** Sous-titre de la home, sous le grand titre. */
  intro:
    'Un podcast audio et vidéo. Chaque épisode est enregistré sur place, dans l’entreprise de l’invité — bureau, atelier, boutique, usine. Ce qui se dit là ne se dit pas en conférence.',

  /** Page À propos. */
  about: {
    statement: [
      'Une marque, vue de l’extérieur, c’est une surface.',
      'On va voir derrière.',
    ],
    body: [
      'Un dirigeant parle autrement quand il parle de chez lui. Devant l’atelier qu’il a monté, dans la boutique qu’il vient d’ouvrir, au milieu de la ligne de production qu’il a fallu convaincre de changer. Le décor n’est pas un décor : c’est le sujet.',
      'Alors nous déplaçons le matériel. Une demi-journée sur place, une conversation longue, sans script, et le contexte qui vient avec — les bruits, la lumière, les objets, les gens qui passent.',
      'De cette rencontre nous tirons un épisode audio, une version vidéo, et une page. Cette page rassemble tout : l’écoute, la vidéo et l’invité. C’est l’adresse de référence de l’épisode — celle qu’on imprime, qu’on partage, qu’on met en QR code.',
    ],
    hostBody: [
      'Frédéric Cronenberger mène les entretiens. Pas d’interview de complaisance, pas de questionnaire envoyé la veille : une conversation préparée, puis laissée libre.',
      'Chaque épisode se termine par une séquence d’analyse de deux ou trois minutes — ce qu’il retient, et ce qu’il en tire pour les autres marques.',
    ],
  },

  /** Bloc de participation. */
  participate: {
    title: 'On vient enregistrer chez vous ?',
    titleAlternatives: [
      'On vient enregistrer chez vous ?',
      'Vous voulez nous recevoir ?',
      'Ouvrez-nous vos portes.',
      'Il se passe quelque chose chez vous. Racontez-le.',
    ],
    intro:
      'Un projet, une transformation, une conviction, un métier qui change. Si le sujet nous semble juste, nous venons enregistrer sur place. Dites-nous en quelques lignes ce dont vous voulez parler.',
    cta: 'Proposer un épisode',
  },

  nav: [
    { label: 'Épisodes', href: '/episodes' },
    { label: 'À propos', href: '/a-propos' },
    { label: 'Participer', href: '/participer' },
  ],

  /** Ticker de la home. */
  ticker: [
    'Derrière la marque',
    'Enregistré sur place',
    'Pas en studio',
    'Un épisode par mois',
  ],
} as const;

/** L'adresse de la production, d'un bloc (voir `site.courriel`). */
export function adresseCourriel(): string {
  return `${site.courriel.nom}@${site.courriel.domaine}`;
}

/**
 * Libellés des plateformes. Volontairement typographiques : pas de logotypes
 * multicolores, le nom suffit et reste cohérent avec la direction artistique.
 */
export const platforms: Record<PlatformKey, { label: string; short: string }> = {
  spotify: { label: 'Spotify', short: 'SP' },
  apple: { label: 'Apple Podcasts', short: 'AP' },
  youtube: { label: 'YouTube', short: 'YT' },
  deezer: { label: 'Deezer', short: 'DZ' },
  amazon: { label: 'Amazon Music', short: 'AM' },
  rss: { label: 'Flux RSS', short: 'RSS' },
};

/** Ordre d'affichage des plateformes dans les blocs « Écouter sur ». */
export const platformOrder: PlatformKey[] = [
  'spotify',
  'apple',
  'youtube',
  'deezer',
  'amazon',
];

/**
 * Page de l'émission sur chaque plateforme. Toutes les adresses sont
 * définitives ; les épisodes (episodes.ts) reprennent celles des plateformes
 * audio, faute de pages d'épisode.
 */
export const showLinks: Partial<Record<PlatformKey, string>> = {
  apple: 'https://podcasts.apple.com/fr/podcast/derriere-la-marque-le-podcast/id6823126719',
  spotify: 'https://open.spotify.com/show/5JNHYFyVvkOE84g0yvbePK',
  // La chaîne, pas une vidéo. Son nom s'écrit bien « marquavec », sans le e.
  youtube: 'https://www.youtube.com/@Derri%C3%A8relamarquavecFred',
  amazon: 'https://music.amazon.com/podcasts/81d78f2e-3439-48fd-93c8-57eb7c4aa3c8',
  deezer: 'https://www.deezer.com/show/1003670492',
};

export type SocialKey = 'instagram' | 'facebook' | 'x';

/** Réseaux sociaux du podcast — les comptes officiels. */
export const social: { key: SocialKey; label: string; url: string }[] = [
  { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/dlmlepodcast/' },
  { key: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61594244070740' },
  { key: 'x', label: 'X', url: 'https://x.com/DLMLEPODCAST' },
];

const compte = (key: SocialKey) => social.find((reseau) => reseau.key === key)?.url;

/**
 * « Disponible sur toutes les plateformes » : la page de l'émission sur chaque
 * plateforme et les comptes officiels, dans l'ordre où la home (`AvailableOn`)
 * et la page d'attente les citent. En texte, sans logo. Chaque nom s'écrit
 * comme la marque l'écrit : pas de capitales forcées, et « Apple Podcasts »
 * avec un s. La copie en ligne de la page d'attente (`page-attente/index.html`)
 * est écrite à la main : toute retouche s'y reporte.
 */
export const presence: { label: string; url?: string }[] = [
  { label: 'YouTube', url: showLinks.youtube },
  { label: 'X', url: compte('x') },
  { label: 'Spotify', url: showLinks.spotify },
  { label: 'Apple Podcasts', url: showLinks.apple },
  { label: 'Instagram', url: compte('instagram') },
  { label: 'Facebook', url: compte('facebook') },
  { label: 'Deezer', url: showLinks.deezer },
  { label: 'Amazon Music', url: showLinks.amazon },
];
