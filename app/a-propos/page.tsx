import Image from 'next/image';
import Link from 'next/link';
import { Ticker } from '@/components/Ticker';
import { site } from '@/content/site';
import { getAllEpisodes } from '@/lib/episodes';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'À propos',
  description: site.about.statement.join(' '),
  path: '/a-propos',
});

export default async function AProposPage() {
  const episodes = await getAllEpisodes();
  const villes = [...new Set(episodes.map((e) => e.recordedAt).filter(Boolean))] as string[];

  return (
    <div className="propos-page">
      {/* --------------------------------------------------- déclaration */}
      <section className="propos__declaration section shell" aria-labelledby="titre-propos">
        <p className="label propos__surtitre">À propos</p>
        <h1 id="titre-propos" className="display propos__titre">
          {site.about.statement.map((ligne, i) => (
            <span key={i} data-reveal-mask="pending" style={{ ['--reveal-delay' as string]: `${i * 140}ms` }}>
              <span>{ligne}</span>
            </span>
          ))}
        </h1>
      </section>

      {/* ---------------------------------------------------- le principe */}
      <section className="propos__principe section regle" aria-labelledby="titre-principe">
        <div className="shell propos__grille">
          <h2 id="titre-principe" className="label propos__etiquette">
            Le principe
          </h2>
          <div className="prose propos__texte" data-reveal="pending">
            {site.about.body.map((paragraphe, i) => (
              <p key={i} className={i === 0 ? 'lede' : undefined}>
                {paragraphe}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- visuel */}
      <section className="propos__visuel" aria-hidden="true">
        <div className="photo photo--braise propos__image">
          <Image
            src="/episodes/micro-noir.jpg"
            alt=""
            width={1800}
            height={1200}
            sizes="100vw"
            loading="lazy"
          />
        </div>
      </section>

      <div className="nuit surface">
        <Ticker items={villes.length > 0 ? villes : site.ticker} duration={42} />
      </div>

      {/* ---------------------------------------------------- animateur */}
      <section className="propos__hote section nuit braise braise--gauche" aria-labelledby="titre-hote">
        <div className="shell propos__grille">
          <h2 id="titre-hote" className="label propos__etiquette">
            L’animateur
          </h2>
          <div className="propos__texte">
            <p className="h2 propos__nom-hote" data-reveal-mask="pending">
              <span>{site.host.name}</span>
            </p>
            <p className="label propos__baseline">{site.host.role}</p>

            <div className="prose propos__prose" data-reveal="pending">
              {site.about.hostBody.map((paragraphe, i) => (
                <p key={i}>{paragraphe}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- suite */}
      <section className="propos__suite section shell">
        <p className="lede">Le reste, c’est dans les épisodes.</p>
        <p>
          <Link href="/episodes" className="bouton">
            Voir les épisodes
            <span className="fleche" aria-hidden="true">
              →
            </span>
          </Link>
        </p>
      </section>
    </div>
  );
}
