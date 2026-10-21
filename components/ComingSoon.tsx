import { presence, site } from '@/content/site';
import { getLatestEpisode } from '@/lib/episodes';
import { Courriel } from './Courriel';
import { SplitLogo } from './SplitLogo';
import { HostSignature } from './Wordmark';

/**
 * Page d'attente — ce que voit le public tant que le site n'est pas ouvert
 * (voir `lib/coming-soon.ts`).
 *
 * La composition est celle de la carte de partage, donc de la pochette claire
 * de la charte : le descripteur en tête, le logotype bleu nuit à l'échelle du
 * cadre sur un fond crème que réchauffe le halo, l'animateur en pied. La page
 * d'attente et son aperçu dans un fil de partage se ressemblent ainsi trait
 * pour trait.
 *
 * Deux actions : voir le dernier épisode, la plus voyante, puis écrire à la
 * production. Le formulaire de participation est fermé avec le reste du site,
 * comme les URLs courtes : le bouton mène droit à la vidéo sur YouTube. Du
 * dernier épisode, seule cette adresse part dans la page. L'adresse de la
 * production, elle, n'y part pas en clair : `Courriel` l'assemble dans le
 * navigateur.
 *
 * La version en ligne est sa copie en HTML statique, dans `page-attente/` :
 * toute retouche se reporte dans les deux. Là-bas, l'adresse de la vidéo est
 * écrite à la main, à remplacer à chaque épisode.
 */
const { nom: NOM, domaine: DOMAINE } = site.courriel;

export async function ComingSoon() {
  const video = (await getLatestEpisode())?.platforms.youtube;

  return (
    <div className="attente shell braise">
      <p className="label attente__surtitre onair">
        {site.descriptor}
        <span className="attente__separateur" aria-hidden="true">/</span>
        Bientôt en ligne
      </p>

      <div className="attente__corps">
        <h1 className="mega attente__signe">
          <span className="sr">{site.name}</span>
          <span aria-hidden="true">
            <SplitLogo step={34} />
          </span>
        </h1>

        <div className="attente__texte">
          <p className="h2 attente__promesse" data-reveal-mask="pending">
            <span>{site.tagline}</span>
          </p>

          <div className="attente__appel" data-reveal="pending">
            <p className="lede attente__intro">{site.intro}</p>
            <div className="attente__actions">
              {video && (
                <a
                  href={video}
                  className="bouton bouton--plein attente__episode"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span className="attente__lecture" aria-hidden="true">
                    <svg viewBox="0 0 10 12" width="10" height="12">
                      <path d="M0 0l10 6-10 6z" />
                    </svg>
                  </span>
                  Voir le dernier épisode
                  <span className="attente__externe" aria-hidden="true">
                    ↗
                  </span>
                </a>
              )}
              <div className="attente__proposer">
                <Courriel nom={NOM} domaine={DOMAINE} sujet={site.participate.cta} className="bouton">
                  {site.participate.cta} <span className="fleche" aria-hidden="true">→</span>
                </Courriel>
                <Courriel nom={NOM} domaine={DOMAINE} afficher className="lien meta" />
              </div>
            </div>
          </div>

          <div className="attente__plateformes" data-reveal="pending">
            <p className="label attente__plateformes-titre">Disponible sur toutes les plateformes&nbsp;:</p>
            <ul className="attente__plateformes-liste">
              {presence.map(({ label, url }, i) => (
                <li key={label}>
                  {url ? (
                    <a href={url} className="lien" target="_blank" rel="noreferrer noopener">
                      {label}
                    </a>
                  ) : (
                    label
                  )}
                  {i < presence.length - 1 && (
                    <span className="attente__point" aria-hidden="true">
                      ·
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="attente__pied regle">
        <HostSignature />
        <p className="label tabulaire">© {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
