import type { Episode } from './types';

/**
 * Les épisodes du podcast.
 *
 * Les ressources citées (`resources`) ne s'affichent pas sur le site : seul le
 * flux RSS les reprend.
 *
 * Les liens d'écoute mènent à la page de l'émission sur chaque plateforme
 * audio et, sur YouTube, à la vidéo de l'épisode — en attendant des liens
 * propres à chaque épisode. `AUDIO` est une piste de démonstration, en
 * attendant le fichier de l'épisode.
 *
 * Ajouter un épisode = ajouter un objet dans ce tableau. Rien d'autre.
 * L'ordre n'a pas d'importance : le tri se fait sur `publishedAt`.
 */

const AUDIO = '/audio/dlm-demo.wav';

export const episodes: Episode[] = [
  {
    id: 'ep-01',
    slug: 'reck',
    episodeNumber: 1,
    // Textes repris des descriptions publiées sur Ausha et YouTube.
    title: 'Faire vivre 140 ans d’histoire',
    excerpt:
      'Comment fait-on vivre une marque que l’on n’a pas créée ? Thomas Riegert, cinquième génération de Reck, raconte l’histoire de cette maison de torréfaction et ce qui se transmet au fil des générations.',
    description: [
      'Comment une entreprise devient-elle une marque ? Et comment la fait-on vivre, génération après génération ?',
      'Pour ce premier épisode de Derrière la marque, je reçois Thomas Riegert, dirigeant de Reck et représentant de la cinquième génération. Avec lui, je remonte le fil de cette maison de torréfaction pour comprendre ce qui fait durer une marque.',
    ],
    publishedAt: '2026-10-15',
    duration: 3942,
    topics: ['Marque', 'Transmission'],
    guest: {
      name: 'Thomas Riegert',
      role: 'Dirigeant',
      company: 'Reck',
      bio: 'Représentant de la cinquième génération, il dirige Reck, artisan torréfacteur à Strasbourg depuis 1884.',
      website: 'https://www.reck.fr',
      // Recadré de la pochette de l'épisode : en attente des photos d'origine.
      portrait: {
        src: '/episodes/reck-portrait.jpg',
        alt: 'Thomas Riegert, dirigeant de Reck, une tasse de la maison à la main.',
        width: 640,
        height: 800,
      },
    },
    coverImage: {
      src: '/episodes/reck-portrait.jpg',
      alt: 'Thomas Riegert, dirigeant de Reck, une tasse de la maison à la main.',
      width: 640,
      height: 800,
    },
    // Photo du tournage MOR09028.jpg, ramenée à 2400 px de large.
    environmentImage: {
      src: '/episodes/env-reck-table.jpg',
      alt: 'Frédéric Cronenberger et Thomas Riegert attablés, téléphone en main, dans une pièce sombre tapissée de livres et de photographies de café.',
      width: 2400,
      height: 1600,
      // Centré, le recadrage mobile ne gardait que Frédéric Cronenberger.
      objectPosition: '80% 50%',
    },
    audioUrl: AUDIO,
    audioBytes: 1280044,
    youtubeId: 'KXqRFQnPbZs',
    // La miniature de la vidéo sur YouTube.
    videoPoster: {
      src: '/episodes/reck-video.jpg',
      alt: 'Frédéric Cronenberger et Thomas Riegert attablés, des tasses Reck devant eux.',
      width: 1280,
      height: 720,
    },
    clientUrl: 'https://www.reck.fr',
    platforms: {
      spotify: 'https://open.spotify.com/show/5JNHYFyVvkOE84g0yvbePK',
      apple: 'https://podcasts.apple.com/fr/podcast/derriere-la-marque-le-podcast/id6823126719',
      youtube: 'https://www.youtube.com/watch?v=KXqRFQnPbZs',
      deezer: 'https://www.deezer.com/show/1003670492',
      amazon: 'https://music.amazon.com/podcasts/81d78f2e-3439-48fd-93c8-57eb7c4aa3c8',
    },
    resources: [
      {
        title: 'Reck — artisan torréfacteur',
        url: 'https://www.reck.fr',
        category: 'Entreprise',
        source: 'Site du client',
      },
    ],
  },
];
