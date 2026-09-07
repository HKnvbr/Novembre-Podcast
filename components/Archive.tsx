'use client';

import { useMemo, useState } from 'react';
import type { Episode } from '@/content/types';
import { EpisodeList } from './EpisodeList';

/** Archive filtrable par rubrique. Le filtre est un enrichissement : sans
 *  JavaScript, la liste complète reste rendue et navigable. */
export function Archive({ episodes, topics }: { episodes: Episode[]; topics: string[] }) {
  const [rubrique, setRubrique] = useState<string | null>(null);

  const visibles = useMemo(
    () => (rubrique ? episodes.filter((e) => e.topics.includes(rubrique)) : episodes),
    [episodes, rubrique],
  );

  const filtrer = (valeur: string | null) => setRubrique(valeur);

  return (
    <>
      <div className="filtres" role="group" aria-label="Filtrer par rubrique">
        <button
          type="button"
          className={`filtre label${rubrique === null ? ' filtre--actif' : ''}`}
          onClick={() => filtrer(null)}
          aria-pressed={rubrique === null}
        >
          Toutes
          <span className="filtre__compte tabulaire">{String(episodes.length).padStart(2, '0')}</span>
        </button>

        {topics.map((topic) => {
          const compte = episodes.filter((e) => e.topics.includes(topic)).length;
          return (
            <button
              key={topic}
              type="button"
              className={`filtre label${rubrique === topic ? ' filtre--actif' : ''}`}
              onClick={() => filtrer(rubrique === topic ? null : topic)}
              aria-pressed={rubrique === topic}
            >
              {topic}
              <span className="filtre__compte tabulaire">{String(compte).padStart(2, '0')}</span>
            </button>
          );
        })}
      </div>

      <p className="sr" role="status">
        {visibles.length} épisode{visibles.length > 1 ? 's' : ''} affiché
        {visibles.length > 1 ? 's' : ''}
        {rubrique ? ` dans la rubrique ${rubrique}` : ''}.
      </p>

      {/* `revele` : sur cette page la liste est le contenu principal — elle ne doit
          dépendre ni d'un défilement ni d'un clic. L'apparition progressive reste
          en place sur la home, où la section arrive en cours de lecture. */}
      <EpisodeList episodes={visibles} revele />
    </>
  );
}
