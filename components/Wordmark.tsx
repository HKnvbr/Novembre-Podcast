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
 */
export function Wordmark({
  taille = 'entete',
  avecMicro = true,
}: {
  taille?: 'entete' | 'lockup';
  avecMicro?: boolean;
}) {
  const nom = (
    <span className="logo__nom" aria-hidden="true">
      <span className="logo__ligne">
        Der<span className="miroir">r</span>ière
      </span>
      <span className="logo__ligne">la marque</span>
    </span>
  );

  return (
    <span className={`logo logo--${taille}`} role="img" aria-label={site.name}>
      {avecMicro && <MicroIcon className="logo__micro" />}
      {nom}
      <span className="logo__descripteur label" aria-hidden="true">
        {site.descriptor}
      </span>
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
