import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Ressources des cartes de partage.
 *
 * Polices et images sont lues sur le disque au moment de la génération (build),
 * jamais sur le réseau : la construction du site reste possible hors ligne et
 * les cartes ne dépendent d'aucun service tiers.
 *
 * Satori n'instancie pas les axes d'une police variable — il rendrait tout en
 * graisse par défaut. Les fichiers `Sora-<poids>.ttf` et
 * `InstrumentSans-<poids>.ttf` sont donc des instances statiques figées,
 * extraites des fichiers variables (`fontTools.varLib.instancer`). C'est ce qui
 * permet d'obtenir le logotype en 800 sur les cartes.
 */

const racine = process.cwd();

export type PoidsTitre = 300 | 400 | 600 | 800;
export type PoidsTexte = 400 | 500;

async function lire(fichier: string): Promise<ArrayBuffer> {
  const contenu = await readFile(join(racine, 'assets', 'fonts', fichier));
  return Uint8Array.from(contenu).buffer;
}

/**
 * Charge les deux familles de la charte sous des noms distincts, pour qu'une
 * carte puisse titrer en « Titre » (rôle Neue Machina) et composer son texte
 * en « Texte » (rôle Neue Montreal).
 */
export async function chargerPolices(
  titres: PoidsTitre[] = [400, 800],
  textes: PoidsTexte[] = [400, 500],
) {
  const [bufTitres, bufTextes] = await Promise.all([
    Promise.all(titres.map((p) => lire(`Sora-${p}.ttf`))),
    Promise.all(textes.map((p) => lire(`InstrumentSans-${p}.ttf`))),
  ]);

  return [
    ...titres.map((p, i) => ({
      name: 'Titre',
      data: bufTitres[i] as ArrayBuffer,
      weight: p as PoidsTitre,
      style: 'normal' as const,
    })),
    ...textes.map((p, i) => ({
      name: 'Texte',
      data: bufTextes[i] as ArrayBuffer,
      weight: p as PoidsTexte,
      style: 'normal' as const,
    })),
  ];
}

/** Satori ne sait pas lire un chemin local : les images doivent être inlinées. */
export async function imageEnDataUri(cheminPublic: string): Promise<string> {
  const fichier = await readFile(join(racine, 'public', cheminPublic.replace(/^\//, '')));
  const type = cheminPublic.endsWith('.png') ? 'image/png' : 'image/jpeg';
  return `data:${type};base64,${fichier.toString('base64')}`;
}

export const OG_TAILLE = { width: 1200, height: 630 } as const;
export const OG_TYPE = 'image/png';

/** Palette de la charte, relevée au pixel sur la planche de nuancier. */
export const OG_COULEURS = {
  creme: '#ece9e4',
  encre: '#0e0f13',
  nuit: '#1a243d',
  nuitProfond: '#141b2e',
  ardoise: '#1d2c3e',
  blanc: '#ffffff',
  brume: '#b1bfcf',
  brumeSourde: '#8490a4',
  orange: '#bd5e27',
  /** Terre cuite assombrie — la seule qui porte du texte sur crème (4,6:1). */
  orangeFonce: '#a94e21',
  /** Gris bleuté du texte secondaire sur crème (5,4:1). */
  plomb: '#565e6c',
  /** Panneau assombri des cartes — c'est lui qui donne 6,5:1 au blanc. */
  panneau: '#97461c',
  orangeTexte: '#d17946',
  orangeClair: '#e08a55',
} as const;

/**
 * Le champ orange de la charte.
 *
 * Satori n'interprète les dégradés que dans `backgroundImage` — dans le
 * raccourci `background`, ils sont silencieusement ignorés. Il ne comprend pas
 * non plus les hexadécimaux à huit chiffres : les opacités s'écrivent en
 * `rgba()`. Et un élément positionné en absolu doit porter des dimensions
 * explicites, sinon le calque n'est pas peint du tout.
 */
export const CHAMP_ORANGE =
  'radial-gradient(126% 116% at 18% 0%, #e08a55 0%, #cc6c33 38%, #bd5e27 100%)';

/**
 * Voile crème posé sur la photographie de la carte — le pendant de
 * `.photo--voile` en registre clair, pour que le logotype bleu nuit tienne quelle
 * que soit l'image fournie. Deux dégradés, comme en CSS.
 */
export const VOILE_CREME = [
  'linear-gradient(100deg, rgba(236,233,228,0.94) 0%, rgba(236,233,228,0.8) 30%, rgba(236,233,228,0.34) 62%, rgba(236,233,228,0) 100%)',
  'linear-gradient(180deg, rgba(236,233,228,0.5) 0%, rgba(236,233,228,0.12) 38%, rgba(236,233,228,0.62) 100%)',
].join(', ');

/**
 * Halo terre cuite sur fond crème — la pochette claire de la charte.
 * Opacités volontairement basses : sur un fond clair, les valeurs du registre
 * bleu nuit feraient une tache.
 */
/* Sur la carte claire, le halo est **linéaire**, pas radial.
   Satori quantifie ses dégradés par paliers : sur un fond clair, un dégradé
   radial y laisse voir des anneaux concentriques, quel que soit le nombre
   d'arrêts. Un dégradé linéaire répartit les mêmes paliers sur une diagonale,
   où l'œil ne les organise plus en cibles. */
export const HALO_CREME = [
  'linear-gradient(118deg, rgba(236,233,228,0) 0%, rgba(236,233,228,0) 42%, rgba(189,94,39,0.05) 72%, rgba(189,94,39,0.11) 100%)',
].join(', ');

/** Halo orange sur fond bleu nuit, pour les compositions en registre nuit. */
export const HALO_NUIT = [
  'radial-gradient(58% 76% at 88% 32%, rgba(224,138,85,0.32) 0%, rgba(189,94,39,0.36) 28%, rgba(189,94,39,0.16) 54%, rgba(26,36,61,0) 84%)',
  'radial-gradient(46% 54% at 96% 76%, rgba(35,46,76,0.7) 0%, rgba(26,36,61,0) 78%)',
].join(', ');
