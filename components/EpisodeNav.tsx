import Image from 'next/image';
import Link from 'next/link';
import type { Episode } from '@/content/types';
import { formatEpisodeNumber } from '@/lib/format';

/** Navigation entre épisodes : deux blocs pleine hauteur, l'image se révèle au survol. */
export function EpisodeNav({
  previous,
  next,
}: {
  previous: Episode | null;
  next: Episode | null;
}) {
  if (!previous && !next) return null;

  return (
    <nav className="suite" aria-label="Épisodes précédent et suivant">
      {previous && <SuiteLien episode={previous} sens="precedent" />}
      {next && <SuiteLien episode={next} sens="suivant" />}
    </nav>
  );
}

function SuiteLien({ episode, sens }: { episode: Episode; sens: 'precedent' | 'suivant' }) {
  return (
    <Link href={`/episodes/${episode.slug}`} className="suite__lien" data-sens={sens}>
      <span className="photo photo--braise suite__fond" aria-hidden="true">
        <Image
          src={episode.coverImage.src}
          alt=""
          width={900}
          height={1125}
          sizes="(max-width: 899px) 100vw, 50vw"
          loading="lazy"
        />
      </span>

      <span className="suite__contenu">
        <span className="label suite__sens">
          {sens === 'precedent' ? (
            <>
              <span className="fleche fleche--gauche" aria-hidden="true">
                ←
              </span>{' '}
              Épisode précédent
            </>
          ) : (
            <>
              Épisode suivant{' '}
              <span className="fleche" aria-hidden="true">
                →
              </span>
            </>
          )}
        </span>
        <span className="suite__numero label tabulaire">
          Épisode {formatEpisodeNumber(episode.episodeNumber)}
        </span>
        <span className="suite__titre h2">{episode.title}</span>
        <span className="suite__invite meta">
          {episode.guest.name}
          <span aria-hidden="true"> — </span>
          {episode.guest.company}
        </span>
      </span>
    </Link>
  );
}
