/**
 * Page d'attente — le site n'est pas encore ouvert au public.
 *
 * Tant que `enAttente` est vrai, la home affiche la page d'attente
 * (`components/ComingSoon.tsx`) et `proxy.ts` renvoie toute autre adresse vers
 * elle. Le site complet reste construit derrière : l'ouvrir ne demande aucun
 * changement de code.
 *
 * Réglage : variable d'environnement `PAGE_ATTENTE`.
 *
 *   absente → page d'attente en production, site complet en développement
 *   `1`     → page d'attente partout — pour la voir avec `npm run dev`
 *   `0`     → site complet partout — c'est le geste d'ouverture
 *
 * La valeur est gravée au build, dans les pages comme dans le proxy (voir
 * `next.config.ts`) : seule la commande de build doit porter la variable, et
 * tout changement demande de reconstruire.
 */
const reglage = process.env.PAGE_ATTENTE;

export const enAttente = reglage ? reglage === '1' : process.env.NODE_ENV === 'production';
