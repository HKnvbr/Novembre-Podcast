import { Archive } from '@/components/Archive';
import { getAllEpisodes, getTopics } from '@/lib/episodes';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Épisodes',
  description:
    'Tous les épisodes de Derrière la marque — des conversations enregistrées sur place, dans l’entreprise de l’invité.',
  path: '/episodes',
});

export default async function EpisodesPage() {
  const episodes = await getAllEpisodes();
  const topics = await getTopics();

  return (
    <div className="archive-page">
      <header className="archive__entete section shell">
        <p className="label archive__surtitre">
          {String(episodes.length).padStart(2, '0')} épisodes
        </p>
        <h1 className="mega archive__titre" data-reveal-mask="pending">
          <span>Épisodes</span>
        </h1>
        <p className="lede archive__intro" data-reveal="pending">
          Une conversation par mois, enregistrée là où l’entreprise travaille. Chaque page réunit
          l’écoute, la vidéo et l’intégralité des références citées.
        </p>
      </header>

      <div className="shell archive__contenu">
        <Archive episodes={episodes} topics={topics} />
      </div>
    </div>
  );
}
