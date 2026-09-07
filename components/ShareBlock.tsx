'use client';

import { useState } from 'react';
import type { Episode } from '@/content/types';

/**
 * Bloc de partage — le cœur de la stratégie d'URL.
 *
 * On expose une seule adresse : `derriere-la-marque.com/[slug]`. C'est elle qu'on
 * copie, qu'on imprime, qu'on encode en QR code. Le QR code est généré côté
 * serveur à partir de cette adresse et jamais à partir d'une URL Spotify ou
 * YouTube — si la diffusion change, le code imprimé reste valide.
 */
export function ShareBlock({ episode, vanity }: { episode: Episode; vanity: string }) {
  const [copie, setCopie] = useState(false);
  const affichage = vanity.replace(/^https?:\/\//, '');

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(vanity);
      setCopie(true);
      window.setTimeout(() => setCopie(false), 2200);
    } catch {
      // Presse-papiers refusé (contexte non sécurisé, permission) : on laisse
      // l'utilisateur sélectionner l'adresse à la main, elle est affichée.
      setCopie(false);
    }
  };

  return (
    <section className="partage regle" aria-labelledby="titre-partage">
      <h2 id="titre-partage" className="label partage__surtitre">
        Partager cet épisode
      </h2>

      <div className="partage__corps">
        <div className="partage__texte">
          <p className="partage__url h3">{affichage}</p>
          <p className="meta partage__note">
            L’adresse de référence de l’épisode. Elle ne change pas, même si les plateformes de
            diffusion changent.
          </p>

          <div className="partage__actions">
            <button type="button" className="bouton" onClick={copier}>
              {copie ? 'Adresse copiée' : 'Copier l’adresse'}
            </button>
            <a className="lien label" href={`/episodes/${episode.slug}/qr.png`} download>
              Télécharger le QR code (PNG)
            </a>
          </div>
        </div>

        <figure className="partage__qr">
          {/* SVG généré à la volée par la route /episodes/[slug]/qr */}
          <img
            src={`/episodes/${episode.slug}/qr`}
            alt={`QR code renvoyant vers ${affichage}`}
            width={220}
            height={220}
            loading="lazy"
          />
          <figcaption className="label partage__legende">{affichage}</figcaption>
        </figure>
      </div>
    </section>
  );
}
