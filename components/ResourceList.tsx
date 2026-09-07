import Image from 'next/image';
import type { Resource } from '@/content/types';

/**
 * « Les liens de l'épisode » — un titre, une source, une catégorie. Chaque
 * ligne est un élément éditorial, pas une carte.
 *
 * Volontairement sans horodatage : relever la minute exacte de chaque référence
 * impose une passe d'écoute par épisode, pour un gain de lecture faible.
 */
export function ResourceList({
  resources,
  titre = 'Les liens de l’épisode',
  compact = false,
}: {
  resources: Resource[];
  titre?: string;
  compact?: boolean;
}) {
  if (resources.length === 0) return null;

  return (
    <section className="ressources" aria-labelledby="titre-ressources">
      <header className="ressources__entete">
        <h2 id="titre-ressources" className="h2 ressources__titre" data-reveal-mask="pending">
          <span>{titre}</span>
        </h2>
        <p className="label ressources__compte tabulaire">
          {String(resources.length).padStart(2, '0')} référence{resources.length > 1 ? 's' : ''}
        </p>
      </header>

      <ul className="ressources__liste regle">
        {resources.map((resource, i) => (
          <li key={`${resource.url}-${i}`} data-reveal="pending" style={{ ['--reveal-delay' as string]: `${i * 45}ms` }}>
            <a
              className="ressource"
              href={resource.url}
              target="_blank"
              rel="noreferrer noopener"
              data-avec-image={!compact && resource.image ? '' : undefined}
            >
              <span className="ressource__index label tabulaire" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>

              <span className="ressource__corps">
                <span className="ressource__titre h3">{resource.title}</span>
                {resource.description && (
                  <span className="ressource__description meta">{resource.description}</span>
                )}
                <span className="ressource__meta label">
                  {resource.source && <span className="ressource__source">{resource.source}</span>}
                  <span className="ressource__categorie">{resource.category}</span>
                </span>
              </span>

              {!compact && resource.image && (
                <span className="photo ressource__vignette">
                  <Image
                    src={resource.image}
                    alt=""
                    width={480}
                    height={320}
                    sizes="160px"
                    loading="lazy"
                  />
                </span>
              )}

              <span className="ressource__fleche fleche" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
