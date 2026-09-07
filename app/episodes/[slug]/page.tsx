import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EpisodeMedia } from '@/components/EpisodeMedia';
import { EpisodeNav } from '@/components/EpisodeNav';
import { GuestCard } from '@/components/GuestCard';
import { JsonLd } from '@/components/JsonLd';
import { PlatformLinks } from '@/components/PlatformLinks';
import { ResourceList } from '@/components/ResourceList';
import { ShareBlock } from '@/components/ShareBlock';
import { site } from '@/content/site';
import { episodeName, getAllEpisodes, getEpisode, getNeighbours, vanityUrl } from '@/lib/episodes';
import { formatDate, formatDuration, formatEpisodeNumber } from '@/lib/format';
import { breadcrumbSchema, episodeSchema, jsonLdGraph } from '@/lib/schema';
import { episodeMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

/** Toutes les pages d'épisode sont pré-rendues au build. */
export async function generateStaticParams() {
  const episodes = await getAllEpisodes();
  return episodes.map((episode) => ({ slug: episode.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const episode = await getEpisode(slug);
  if (!episode) return { title: 'Épisode introuvable' };
  return episodeMetadata(episode);
}

export default async function EpisodePage({ params }: Props) {
  const { slug } = await params;
  const episode = await getEpisode(slug);
  if (!episode) notFound();

  const { previous, next } = await getNeighbours(slug);
  const numero = formatEpisodeNumber(episode.episodeNumber);

  return (
    <article className="episode">
      {/* ---------------------------------------------------------- hero */}
      <header className="ephero">
        <div className="photo photo--braise photo--voile ephero__fond">
          <Image
            src={(episode.environmentImage ?? episode.coverImage).src}
            alt={(episode.environmentImage ?? episode.coverImage).alt}
            width={(episode.environmentImage ?? episode.coverImage).width}
            height={(episode.environmentImage ?? episode.coverImage).height}
            sizes="100vw"
            priority
            quality={82}
          />
        </div>

        <div className="ephero__contenu shell">
          <nav className="ephero__fil label" aria-label="Fil d’Ariane">
            <Link href="/" className="lien">
              Podcast
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/episodes" className="lien">
              Épisodes
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Épisode {numero}</span>
          </nav>

          <div className="ephero__bloc">
            <p className="label ephero__numero tabulaire">Épisode {numero}</p>

            <p className="ephero__invite h2" data-reveal-mask="pending">
              <span>{episodeName(episode)}</span>
            </p>
            <p className="ephero__fonction lede">{episode.guest.role}</p>

            <h1 className="display ephero__titre" data-reveal-mask="pending">
              <span>{episode.title}</span>
            </h1>

            <p className="label ephero__infos tabulaire">
              {formatDate(episode.publishedAt)}
              <span aria-hidden="true"> · </span>
              {formatDuration(episode.duration)}
              {episode.recordedAt && (
                <>
                  <span aria-hidden="true"> · </span>
                  {episode.recordedAt}
                </>
              )}
              <span aria-hidden="true"> · </span>
              {episode.topics.join(' · ')}
            </p>
          </div>
        </div>
      </header>

      {/* ------------------------------------------- corps éditorial --- */}
      <div className="epcorps section shell">
        <div className="epcorps__grille">
          <div className="epcorps__principal">
            <div className="epcorps__texte prose" data-reveal="pending">
              {episode.description.map((paragraphe, i) => (
                <p key={i} className={i === 0 ? 'lede' : undefined}>
                  {paragraphe}
                </p>
              ))}
            </div>

            <EpisodeMedia episode={episode} />
          </div>

          <aside className="epcorps__cote" aria-label="Écoute et diffusion">
            <PlatformLinks episode={episode} titre="Écouter ailleurs" />

            {episode.clientUrl && (
              <p className="epcorps__client">
                <a
                  className="lien label"
                  href={`/${episode.slug}/site`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Site de {episode.guest.company} <span aria-hidden="true">↗</span>
                </a>
              </p>
            )}
          </aside>
        </div>
      </div>

      {/* --------------------------------------------- les liens ------- */}
      <div className="section shell regle">
        <ResourceList resources={episode.resources} />
      </div>

      {/* --------------------------------------------- l'invité -------- */}
      <div className="section--serre shell">
        <GuestCard guest={episode.guest} />
      </div>

      {/* --------------------------------------------- partage / QR ---- */}
      <div className="section--serre shell">
        <ShareBlock episode={episode} vanity={vanityUrl(episode)} />
      </div>

      <EpisodeNav previous={previous} next={next} />

      <JsonLd
        data={jsonLdGraph(
          episodeSchema(episode),
          breadcrumbSchema([
            { name: site.name, path: '/' },
            { name: 'Épisodes', path: '/episodes' },
            { name: episode.title, path: `/episodes/${episode.slug}` },
          ]),
        )}
      />
    </article>
  );
}
