import Image from 'next/image';
import { ParticiperForm } from '@/components/ParticiperForm';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Participer',
  description: site.participate.intro,
  path: '/participer',
});

const etapes = [
  {
    titre: 'Vous nous écrivez',
    texte: 'Quelques lignes sur le sujet. Ce qui a changé chez vous, ce que vous avez appris.',
  },
  {
    titre: 'On en parle',
    texte: 'Un échange d’une demi-heure pour cadrer l’angle. Pas de questionnaire à remplir.',
  },
  {
    titre: 'On vient enregistrer',
    texte: 'Une demi-journée chez vous. Deux personnes, un peu de matériel, aucune mise en scène.',
  },
  {
    titre: 'Vous relisez',
    texte: 'Vous validez le montage et la page avant publication. Puis l’épisode est à vous aussi.',
  },
];

export default function ParticiperPage() {
  return (
    <div className="participer-page">
      <section className="participer__entete section shell" aria-labelledby="titre-participer">
        <p className="label participer__surtitre">Participer</p>
        <h1 id="titre-participer" className="display participer__titre" data-reveal-mask="pending">
          <span>{site.participate.title}</span>
        </h1>
        <p className="lede participer__intro" data-reveal="pending">
          {site.participate.intro}
        </p>
      </section>

      <section className="participer__etapes section--serre regle" aria-labelledby="titre-etapes">
        <div className="shell">
          <h2 id="titre-etapes" className="label participer__etiquette">
            Comment ça se passe
          </h2>
          <ol className="etapes">
            {etapes.map((etape, i) => (
              <li key={etape.titre} data-reveal="pending" style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}>
                <span className="label etapes__index tabulaire" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="h3 etapes__titre">{etape.titre}</h3>
                <p className="meta">{etape.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Une image, pas une illustration : le matériel qu'on apporte chez vous. */}
      <section className="participer__visuel" aria-hidden="true">
        <div className="photo photo--braise participer__image">
          <Image
            src="/episodes/micro-studio.jpg"
            alt=""
            width={1800}
            height={1200}
            sizes="100vw"
            loading="lazy"
          />
        </div>
      </section>

      <section className="participer__formulaire section nuit braise braise--basse" aria-labelledby="titre-formulaire">
        <div className="shell">
          <h2 id="titre-formulaire" className="h1 participer__question" data-reveal-mask="pending">
            <span>Racontez-nous.</span>
          </h2>
          <ParticiperForm />
        </div>
      </section>
    </div>
  );
}
