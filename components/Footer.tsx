import Link from 'next/link';
import { site } from '@/content/site';
import { HostSignature, Wordmark } from './Wordmark';

export function Footer() {
  return (
    <footer id="pied" className="pied braise braise--basse">
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
            <a href={`mailto:${site.email}`} className="lien meta pied__mail">
              {site.email}
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
              <li><a href="/feed.xml" className="lien">Flux RSS</a></li>
              <li>
                <a href={`mailto:${site.email}`} className="lien">
                  Nous écrire
                </a>
              </li>
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
