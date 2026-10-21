import Link from 'next/link';
import { adresseCourriel, platformOrder, platforms, site, social } from '@/content/site';
import { getLatestEpisode } from '@/lib/episodes';
import { HostSignature, Wordmark } from './Wordmark';

export async function Footer() {
  const dernier = await getLatestEpisode();
  const ecoute = dernier ? platformOrder.filter((key) => dernier.platforms[key]) : [];

  return (
    <footer id="pied" className="pied nuit braise braise--basse">
      <div className="shell">
        <div className="pied__haut">
          <p className="pied__promesse display">
            On vient
            <br />
            enregistrer
            <br />
            chez vous&nbsp;?
          </p>
          <div className="pied__action">
            <Link href="/participer" className="bouton bouton--plein">
              {site.participate.cta} <span className="fleche" aria-hidden="true">→</span>
            </Link>
            <a href={`mailto:${adresseCourriel()}`} className="lien meta pied__mail">
              {adresseCourriel()}
            </a>
          </div>
        </div>

        <div className="pied__grille regle">
          <div className="pied__colonne pied__colonne--marque">
            <Link href="/" className="pied__logo" aria-label={`${site.name} — accueil`}>
              <Wordmark taille="lockup" avecMicro />
            </Link>
            <HostSignature className="pied__signature" />
          </div>

          <div className="pied__colonne">
            <h2 className="label pied__titre">Le podcast</h2>
            <ul className="pied__liste">
              <li><Link href="/episodes" className="lien">Tous les épisodes</Link></li>
              <li><Link href="/a-propos" className="lien">À propos</Link></li>
              <li><Link href="/participer" className="lien">Participer</Link></li>
            </ul>
          </div>

          <div className="pied__colonne">
            <h2 className="label pied__titre">Écouter</h2>
            <ul className="pied__liste">
              {dernier &&
                ecoute.map((key) => (
                  <li key={key}>
                    <a href={`/${dernier.slug}/${key}`} className="lien" target="_blank" rel="noreferrer noopener">
                      {platforms[key].label}
                    </a>
                  </li>
                ))}
              <li><a href="/feed.xml" className="lien">Flux RSS</a></li>
              <li>
                <a href={`mailto:${adresseCourriel()}`} className="lien">
                  Nous écrire
                </a>
              </li>
            </ul>
          </div>

          <div className="pied__colonne">
            <h2 className="label pied__titre">Suivre</h2>
            <ul className="pied__liste">
              {social.map((reseau) => (
                <li key={reseau.key}>
                  <a href={reseau.url} className="lien" target="_blank" rel="noreferrer noopener">
                    {reseau.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pied__bas regle">
          <p className="label">{site.name}</p>
          <p className="label pied__annee tabulaire">© {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
