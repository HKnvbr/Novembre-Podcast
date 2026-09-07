import Image from 'next/image';
import Link from 'next/link';
import { SplitLogo } from '@/components/SplitLogo';
import { HostSignature } from '@/components/Wordmark';
import { site } from '@/content/site';
import type { Episode } from '@/content/types';
import { guestLine } from '@/lib/episodes';
import { formatDate, formatDuration, formatEpisodeRef } from '@/lib/format';

/**
 * Hero de la home : le dernier épisode, en pleine page.
 *
 * Le logotype posé à l'échelle du cadre sur le bord inférieur est le geste
 * central de la charte. La photographie est assombrie, réchauffée d'une lumière
 * rasante orange et voilée, pour que la typographie tienne quelle que soit
 * l'image fournie.
 */
export function Hero({ episode }: { episode: Episode }) {
  const numero = formatEpisodeRef(episode.episodeNumber);
  const visuel = episode.environmentImage ?? episode.coverImage;

  return (
    <section className="hero" aria-labelledby="titre-hero">
      <div className="photo photo--braise photo--voile hero__fond">
        {episode.heroVideo ? (
          <video
            src={episode.heroVideo}
            poster={visuel.src}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        ) : (
          <Image
            src={visuel.src}
            alt={visuel.alt}
            width={visuel.width}
            height={visuel.height}
            sizes="100vw"
            priority
            quality={82}
          />
        )}
      </div>

      <div className="hero__contenu shell">
        <p className="label hero__surtitre onair">
          {site.descriptor}
          <span className="hero__separateur" aria-hidden="true">/</span>
          Dernier épisode
        </p>

        <div className="hero__bloc">
          <p className="label hero__numero tabulaire">Épisode {numero}</p>

          <p className="hero__invite h2" data-reveal-mask="pending">
            <span>{episode.guest.company}</span>
          </p>
          <p className="hero__fonction lede">{guestLine(episode)}</p>

          <h1 id="titre-hero" className="hero__titre" data-reveal-mask="pending">
            <span>{episode.title}</span>
          </h1>

          <p className="label hero__infos tabulaire">
            {formatDate(episode.publishedAt)}
            <span aria-hidden="true"> · </span>
            {formatDuration(episode.duration)}
            {episode.recordedAt && (
              <>
                <span aria-hidden="true"> · </span>
                Enregistré à {episode.recordedAt}
              </>
            )}
          </p>

          <div className="hero__actions">
            <Link href={`/episodes/${episode.slug}`} className="bouton bouton--plein">
              Écouter l’épisode
              <span className="fleche" aria-hidden="true">→</span>
            </Link>
            {episode.youtubeId && (
              <a
                href={`/${episode.slug}/youtube`}
                className="bouton"
                target="_blank"
                rel="noreferrer noopener"
              >
                Voir l’épisode
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>

          <HostSignature className="hero__signature-hote" />
        </div>
      </div>

      {/* Le logotype, à l'échelle du cadre, révélé lettre à lettre. */}
      <p className="hero__signe mega" aria-hidden="true">
        <SplitLogo lignes={1} step={28} />
      </p>
    </section>
  );
}
