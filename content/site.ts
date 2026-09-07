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

  url: 'https://derriere-la-marque.com',
  locale: 'fr_FR',
  lang: 'fr',
  email: 'contact@derriere-la-marque.com',

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
      'De cette rencontre nous tirons un épisode audio, une version vidéo, et une page. Cette page rassemble tout : l’écoute, l’invité, et l’intégralité des références citées pendant la discussion. C’est l’adresse de référence de l’épisode — celle qu’on imprime, qu’on partage, qu’on met en QR code.',
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
  castbox: { label: 'Castbox', short: 'CB' },
  rss: { label: 'Flux RSS', short: 'RSS' },
};

/** Ordre d'affichage des plateformes dans les blocs « Écouter sur ». */
export const platformOrder: PlatformKey[] = [
  'spotify',
  'apple',
  'youtube',
  'deezer',
  'amazon',
  'castbox',
];
