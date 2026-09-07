'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Episode } from '@/content/types';
import { guestLine } from '@/lib/episodes';
import { formatDuration, formatEpisodeNumber, formatMonth } from '@/lib/format';

/**
 * Archive éditoriale — une liste, pas une grille de cartes.
 *
 * Micro-interaction : au survol d'une ligne, le portrait de l'invité suit le
 * curseur. C'est la seule fantaisie du site, et elle remplace utilement des
 * vignettes qui alourdiraient la liste. Désactivée au pointeur grossier et sous
 * `prefers-reduced-motion` ; une vignette statique prend le relais en mobile.
 */
export function EpisodeList({
  episodes,
  revele = false,
}: {
  episodes: Episode[];
  /** Rend la liste immédiatement visible, sans attendre le défilement. Utilisé
   *  après un changement de filtre : l'apparition progressive a du sens à
   *  l'arrivée sur la page, pas en réponse à un clic. */
  revele?: boolean;
}) {
  const [survol, setSurvol] = useState<number | null>(null);
  const apercu = useRef<HTMLDivElement>(null);
  const actif = useRef(false);

  useEffect(() => {
    const fin = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fin || reduit) return;
    actif.current = true;

    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const boucle = () => {
      // Suivi amorti : l'image traîne légèrement derrière le curseur.
      cx += (x - cx) * 0.12;
      cy += (y - cy) * 0.12;
      const el = apercu.current;
      if (el) el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(boucle);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(boucle);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const courant = survol !== null ? episodes[survol] : undefined;

  return (
    <div className="archive" onPointerLeave={() => setSurvol(null)}>
      <ul className="archive__liste regle">
        {episodes.map((episode, i) => (
          <li
            key={episode.slug}
            data-reveal={revele ? undefined : 'pending'}
            style={{ ['--reveal-delay' as string]: `${i * 55}ms` }}
          >
            <Link
              href={`/episodes/${episode.slug}`}
              className="ligne"
              onPointerEnter={() => actif.current && setSurvol(i)}
              onFocus={() => setSurvol(null)}
            >
              <span className="ligne__numero label tabulaire" aria-hidden="true">
                {formatEpisodeNumber(episode.episodeNumber)}
              </span>

              <span className="photo ligne__vignette">
                <Image
                  src={episode.coverImage.src}
                  alt=""
                  width={320}
                  height={400}
                  sizes="96px"
                  loading="lazy"
                />
              </span>

              <span className="ligne__identite">
                <span className="ligne__invite h3">{episode.guest.company}</span>
                <span className="ligne__societe meta">{guestLine(episode)}</span>
              </span>

              <span className="ligne__titre">{episode.title}</span>

              <span className="ligne__topics label">{episode.topics.join(' · ')}</span>

              <span className="ligne__infos label tabulaire">
                <span className="ligne__date">{formatMonth(episode.publishedAt)}</span>
                <span className="ligne__duree">{formatDuration(episode.duration)}</span>
              </span>

              <span className="ligne__fleche fleche" aria-hidden="true">
                →
              </span>

              <span className="sr">
                Épisode {formatEpisodeNumber(episode.episodeNumber)}, {episode.guest.company} —{' '}
                {episode.title}. {guestLine(episode)}. {formatDuration(episode.duration)}.
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Aperçu flottant — purement décoratif, retiré de l'arbre d'accessibilité. */}
      <div ref={apercu} className="apercu" data-visible={courant ? '' : undefined} aria-hidden="true">
        {courant && (
          <div className="photo apercu__image">
            <Image
              src={courant.coverImage.src}
              alt=""
              width={640}
              height={800}
              sizes="320px"
              priority={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
