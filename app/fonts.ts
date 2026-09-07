import localFont from 'next/font/local';

/**
 * Typographie de la marque — deux familles, comme le fichier de charte.
 *
 * La charte est composée en polices Pangram Pangram, sous licence commerciale,
 * donc non embarquées ici :
 *
 *   PP Neue Machina  → logotype et titres H1
 *   PP Neue Montreal → noms et texte courant
 *
 * Deux substituts libres tiennent ces rôles, choisis en comparant les rendus
 * aux planches typographiques du fichier :
 *
 *   Sora            → même ADN géométrique à courbes carrées que Neue Machina
 *   Instrument Sans → néo-grotesque de même largeur étroite que Neue Montreal
 *
 * Les noms sous licence sont malgré tout déclarés **en premier** dans les piles
 * de `globals.css` : déposer les fichiers dans `assets/fonts` et les déclarer
 * ici suffit à leur rendre la main, sans autre modification.
 *
 * Fichiers variables uniques : une requête par famille.
 */

export const titre = localFont({
  src: [{ path: '../assets/fonts/sora-variable.woff2', weight: '300 800', style: 'normal' }],
  display: 'swap',
  variable: '--font-titre',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
  preload: true,
});

export const texte = localFont({
  src: [{ path: '../assets/fonts/instrument-sans-variable.woff2', weight: '400 600', style: 'normal' }],
  display: 'swap',
  variable: '--font-texte',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
  preload: true,
});
