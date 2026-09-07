import Link from 'next/link';
import { getAllEpisodes } from '@/lib/episodes';
import { formatEpisodeNumber } from '@/lib/format';

export const metadata = { title: 'Page introuvable' };

export default async function NotFound() {
  const episodes = (await getAllEpisodes()).slice(0, 3);

  return (
    <div className="introuvable section shell braise braise--gauche">
      <p className="label introuvable__code tabulaire">Erreur 404</p>
      <h1 className="mega introuvable__titre">
        <span>Rien ici.</span>
      </h1>
      <p className="lede introuvable__texte">
        L’adresse demandée ne correspond à aucun épisode. Les adresses du podcast ont la forme{' '}
        <span className="introuvable__exemple">derriere-la-marque.com/nom-du-client</span>.
      </p>

      <ul className="introuvable__liste regle">
        {episodes.map((episode) => (
          <li key={episode.slug}>
            <Link href={`/episodes/${episode.slug}`} className="introuvable__lien">
              <span className="label tabulaire">
                Épisode {formatEpisodeNumber(episode.episodeNumber)}
              </span>
              <span className="h3">{episode.title}</span>
              <span className="meta">
                {episode.guest.name} — {episode.guest.company}
              </span>
              <span className="fleche" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="introuvable__actions">
        <Link href="/episodes" className="bouton">
          Voir tous les épisodes
          <span className="fleche" aria-hidden="true">
            →
          </span>
        </Link>
      </p>
    </div>
  );
}
