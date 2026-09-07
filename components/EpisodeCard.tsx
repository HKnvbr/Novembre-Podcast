import Image from 'next/image';
import Link from 'next/link';
import type { Episode } from '@/content/types';
import { guestCredit } from '@/lib/episodes';
import { formatDuration, formatEpisodeRef } from '@/lib/format';
import { site } from '@/content/site';
import { Wordmark } from './Wordmark';

/**
 * La carte d'épisode de la charte révisée.
 *
 * Elle est reprise telle quelle de la planche : un cadre arrondi coupé en deux,
 * la photographie à gauche sous le logotype augmenté du nom du client, le
 * panneau de texte à droite sur l'orange assombri.
 *
 * Deux choses ne sont pas des choix libres :
 *
 *  - Le panneau est plus sombre que le champ orange qui l'entoure. Le fichier
 *    procède ainsi, et le contraste explique pourquoi : du blanc sur l'orange de
 *    marque plafonne à 4,4:1, sur l'orange assombri il atteint 6,5:1. Le
 *    dégradé n'est donc pas décoratif, il est ce qui rend le bloc lisible.
 *  - Le nom du client est la troisième ligne du logotype, pas une légende. Voir
 *    `Wordmark`.
 */
export function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <article className="carte brasier">
      <Link href={`/episodes/${episode.slug}`} className="carte__lien">
        <span className="sr">
          Épisode {formatEpisodeRef(episode.episodeNumber)} — Derrière la marque{' '}
          {episode.guest.company}. {guestCredit(episode)}. {formatDuration(episode.duration)}.
        </span>
      </Link>

      <div className="carte__visuel photo photo--voile">
        <Image
          src={episode.coverImage.src}
          alt=""
          width={episode.coverImage.width}
          height={episode.coverImage.height}
          sizes="(max-width: 899px) 100vw, 34vw"
        />
        <Wordmark
          taille="lockup"
          avecMicro={false}
          avecDescripteur={false}
          marque={episode.guest.company}
          className="logo--carte"
        />
        <p className="carte__etiquette label">{site.descriptor}</p>
        <p className="carte__avec">
          Avec <strong>{episode.guest.name}</strong>
        </p>
      </div>

      <div className="carte__panneau panneau">
        <p className="label carte__numero tabulaire">
          Épisode {formatEpisodeRef(episode.episodeNumber)}
        </p>
        <p className="carte__nom h3">Derrière la marque {episode.guest.company}</p>
        <p className="carte__credit label">
          <strong>Avec {episode.guest.name}</strong>
          <span className="carte__role">{episode.guest.role}</span>
        </p>
        <p className="carte__duree meta tabulaire">{formatDuration(episode.duration)}</p>
      </div>
    </article>
  );
}
