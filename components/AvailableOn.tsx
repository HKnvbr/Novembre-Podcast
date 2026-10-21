import { presence } from '@/content/site';

/**
 * Bandeau « Disponible sur toutes les plateformes » de la home. Pas de logos :
 * le nom de chaque plateforme, dessiné comme dans le bloc « Écouter sur »
 * (`PlatformLinks`), et le lien direct vers la page de l'émission ou le compte
 * officiel. La page d'attente cite la même liste.
 */
export function AvailableOn() {
  const liens = presence.filter((lien) => lien.url);

  return (
    <section className="presence section" aria-labelledby="titre-presence">
      <div className="shell">
        <h2 id="titre-presence" className="display presence__titre" data-reveal-mask="pending">
          <span>Disponible sur toutes les plateformes</span>
        </h2>

        <ul className="plateformes__liste presence__liste">
          {liens.map(({ label, url }) => (
            <li key={label}>
              <a className="plateforme" href={url} target="_blank" rel="noreferrer noopener">
                <span className="plateforme__nom">{label}</span>
                <span className="plateforme__fleche fleche" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
