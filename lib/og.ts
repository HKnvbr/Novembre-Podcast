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

/** Palette de la charte, pour les cartes générées. */
export const OG_COULEURS = {
  nuit: '#1a243d',
  nuitProfond: '#141b2e',
  blanc: '#ffffff',
  brume: '#b0c0d0',
  brumeSourde: '#8490a4',
  encre: '#121212',
  orange: '#c4662e',
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
  'radial-gradient(126% 116% at 18% 0%, #e08a55 0%, #d17946 38%, #c4662e 100%)';

/** Halo orange sur fond bleu nuit, pour la carte par défaut. */
export const HALO_NUIT = [
  'radial-gradient(58% 76% at 88% 32%, rgba(224,138,85,0.32) 0%, rgba(196,102,46,0.36) 28%, rgba(196,102,46,0.16) 54%, rgba(26,36,61,0) 84%)',
  'radial-gradient(46% 54% at 96% 76%, rgba(35,46,76,0.7) 0%, rgba(26,36,61,0) 78%)',
].join(', ');
