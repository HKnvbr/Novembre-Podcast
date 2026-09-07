import Link from 'next/link';
import { EpisodeCard } from '@/components/EpisodeCard';
import { EpisodeList } from '@/components/EpisodeList';
import { EpisodeMedia } from '@/components/EpisodeMedia';
import { Hero } from '@/components/Hero';
import { PlatformLinks } from '@/components/PlatformLinks';
import { ResourceList } from '@/components/ResourceList';
import { Ticker } from '@/components/Ticker';
import { site } from '@/content/site';
import { getAllEpisodes, getLatestEpisode } from '@/lib/episodes';
import { formatDate, formatDuration, formatEpisodeNumber } from '@/lib/format';

export default async function HomePage() {
  const dernier = await getLatestEpisode();
  const tous = await getAllEpisodes();

  if (!dernier) {
    return (
      <section className="section shell">
        <h1 className="display">Bientôt.</h1>
        <p className="lede">Le premier épisode arrive.</p>
      </section>
    );
  }

  const autres = tous.filter((episode) => episode.slug !== dernier.slug);

  return (
    <>
      <Hero episode={dernier} />

      {/* ------------------------------------------------- la promesse --- */}
      <section className="manifeste section nuit braise braise--gauche" aria-labelledby="titre-manifeste">
        <div className="shell manifeste__corps">
          <h2 id="titre-manifeste" className="display manifeste__titre">
            <span data-reveal-mask="pending">
              <span>On va enregistrer</span>
            </span>
            <span data-reveal-mask="pending">
              <span>là où la marque</span>
            </span>
            <span data-reveal-mask="pending">
              <span>se fabrique.</span>
            </span>
          </h2>

          <div className="manifeste__pied">
            <p className="lede manifeste__intro" data-reveal="pending">
              {site.intro}
            </p>
            <Link href="/a-propos" className="lien label" data-reveal="pending">
              Le principe <span className="fleche" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="nuit surface">
        <Ticker items={site.ticker} />
      </div>

      {/* -------------------------------------------- dernier épisode --- */}
      <section
        id="dernier-episode"
        className="dernier section"
        aria-labelledby="titre-dernier"
      >
        <div className="shell">
          <header className="dernier__entete">
            <h2 id="titre-dernier" className="label dernier__surtitre">
              Le dernier épisode
            </h2>
            <p className="label dernier__numero tabulaire">
              Épisode {formatEpisodeNumber(dernier.episodeNumber)}
            </p>
          </header>

          <div className="dernier__corps">
            <div className="dernier__visuel" data-reveal="pending">
              <EpisodeCard episode={dernier} />
              <p className="label dernier__legende">
                Enregistré {dernier.recordedAt ? `à ${dernier.recordedAt}` : 'sur place'}
              </p>
            </div>

            <div className="dernier__editorial">
              <p className="dernier__meta label tabulaire">
                {formatDate(dernier.publishedAt)}
                <span aria-hidden="true"> · </span>
                {formatDuration(dernier.duration)}
                <span aria-hidden="true"> · </span>
                {dernier.topics.join(' · ')}
              </p>

              <h3 className="h1 dernier__titre" data-reveal-mask="pending">
                <span>{dernier.title}</span>
              </h3>

              <p className="lede dernier__accroche" data-reveal="pending">
                {dernier.excerpt}
              </p>

              <EpisodeMedia episode={dernier} />

              <PlatformLinks episode={dernier} />

              <p className="dernier__vers-page">
                <Link href={`/episodes/${dernier.slug}`} className="lien label">
                  Voir la page complète de l’épisode{' '}
                  <span className="fleche" aria-hidden="true">
                    →
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------- liens de l'épisode --- */}
      <div className="section shell regle">
        <ResourceList resources={dernier.resources} />
      </div>

      {/* --------------------------------------------- tous les épisodes */}
      <section className="tous section surface" aria-labelledby="titre-tous">
        <div className="shell">
          <header className="tous__entete">
            <h2 id="titre-tous" className="display tous__titre" data-reveal-mask="pending">
              <span>Tous les épisodes</span>
            </h2>
            <p className="label tous__compte tabulaire">
              {String(tous.length).padStart(2, '0')} épisodes
            </p>
          </header>

          <EpisodeList episodes={autres} />

          <p className="tous__lien">
            <Link href="/episodes" className="bouton">
              Voir l’archive complète
              <span className="fleche" aria-hidden="true">
                →
              </span>
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
