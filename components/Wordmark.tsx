import { site } from '@/content/site';
import { MicroIcon } from './MicroIcon';

/**
 * Logotype « DERᴙIÈRE LA MARQUE ».
 *
 * Dessiné en typographie, pas en image : il reste net à toute taille et hérite
 * de la couleur de son contexte. Le geste de la marque est le **troisième R,
 * retourné** — un `scaleX(-1)` sur une seule lettre. Le mot est donc découpé
 * en trois fragments, et le nom complet est restitué aux technologies
 * d'assistance par `aria-label`.
 *
 * `taille` :
 *  - `entete`  : version compacte sur une ligne, pour la barre de navigation
 *  - `lockup`  : version empilée avec le micro et le descripteur
 *
 * `marque` ajoute une troisième ligne au logotype. C'est le verrou de la charte
 * révisée : sur la carte d'épisode et sur la pochette, le nom du client **entre
 * dans** le logotype au lieu de se poser à côté.
 *
 *   DERᴙIÈRE
 *   LA MARQUE
 *   RECK
 */
export function Wordmark({
  taille = 'entete',
  avecMicro = true,
  avecDescripteur = true,
  marque,
  className,
}: {
  taille?: 'entete' | 'lockup';
  avecMicro?: boolean;
  avecDescripteur?: boolean;
  marque?: string;
  className?: string;
}) {
  const nom = (
    <span className="logo__nom" aria-hidden="true">
      <span className="logo__ligne">
        Der<span className="miroir">r</span>ière
      </span>
      <span className="logo__ligne">la marque</span>
      {marque && <span className="logo__ligne logo__ligne--marque">{marque}</span>}
    </span>
  );

  return (
    <span
      className={`logo logo--${taille}${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={marque ? `${site.name} ${marque}` : site.name}
    >
      {avecMicro && <MicroIcon className="logo__micro" />}
      {nom}
      {avecDescripteur && (
        <span className="logo__descripteur label" aria-hidden="true">
          {site.descriptor}
        </span>
      )}
    </span>
  );
}

/** « Avec Frédéric Cronenberger » — la signature de l'animateur. */
export function HostSignature({ className }: { className?: string }) {
  return (
    <p className={`signature${className ? ` ${className}` : ''}`}>
      <span className="signature__avec">Avec</span>{' '}
      <span className="signature__nom">{site.host.name}</span>
    </p>
  );
}
