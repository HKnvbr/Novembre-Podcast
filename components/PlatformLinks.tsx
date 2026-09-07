import { platformOrder, platforms, site } from '@/content/site';
import type { Episode } from '@/content/types';

/**
 * Bloc « Écouter sur ». Deux partis pris :
 *
 * 1. Pas de logotypes multicolores — le nom des plateformes, en capitales,
 *    comme le reste du site.
 * 2. Les liens pointent sur nos propres URLs courtes
 *    (`/[slug]/spotify`), jamais directement sur la plateforme. On garde ainsi
 *    la main sur la destination, et la mesure au passage.
 */
export function PlatformLinks({
  episode,
  titre = 'Écouter sur',
}: {
  episode: Episode;
  titre?: string;
}) {
  const disponibles = platformOrder.filter((key) => episode.platforms[key]);
  if (disponibles.length === 0) return null;

  return (
    <section className="plateformes" aria-labelledby={`plateformes-${episode.slug}`}>
      <h2 id={`plateformes-${episode.slug}`} className="label plateformes__titre">
        {titre}
      </h2>
      <ul className="plateformes__liste">
        {disponibles.map((key) => (
          <li key={key}>
            <a
              className="plateforme"
              href={`/${episode.slug}/${key}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className="plateforme__nom">{platforms[key].label}</span>
              <span className="plateforme__fleche fleche" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        ))}
        <li>
          <a className="plateforme plateforme--rss" href="/feed.xml">
            <span className="plateforme__nom">{platforms.rss.label}</span>
            <span className="plateforme__fleche fleche" aria-hidden="true">
              ↗
            </span>
          </a>
        </li>
      </ul>
      <p className="plateformes__note meta">
        Ces liens passent par {site.url.replace('https://', '')} : la destination peut changer,
        l’adresse partagée reste la même.
      </p>
    </section>
  );
}
