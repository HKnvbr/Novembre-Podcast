'use client';

import { useState } from 'react';
import { site } from '@/content/site';

/**
 * Formulaire de proposition d'épisode.
 *
 * Six champs, pas un de plus. La validation est celle du navigateur (contraintes
 * HTML natives), complétée d'un message d'erreur unique lisible au lecteur
 * d'écran. L'envoi passe par `/api/participer`, à brancher sur l'outil de
 * l'agence (Brevo, CRM, boîte partagée) — voir le commentaire de la route.
 */

type Etat = 'repos' | 'envoi' | 'ok' | 'erreur';

const CHAMPS = [
  { name: 'nom', label: 'Nom et prénom', type: 'text', required: true, autoComplete: 'name' },
  { name: 'entreprise', label: 'Entreprise', type: 'text', required: true, autoComplete: 'organization' },
  { name: 'fonction', label: 'Fonction', type: 'text', required: true, autoComplete: 'organization-title' },
  { name: 'email', label: 'Email professionnel', type: 'email', required: true, autoComplete: 'email' },
  { name: 'sujet', label: 'Sujet proposé', type: 'text', required: true, autoComplete: 'off' },
] as const;

export function ParticiperForm() {
  const [etat, setEtat] = useState<Etat>('repos');
  const [message, setMessage] = useState('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setEtat('envoi');
    setMessage('');

    try {
      const reponse = await fetch('/api/participer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!reponse.ok) throw new Error(String(reponse.status));
      setEtat('ok');
      form.reset();
    } catch {
      setEtat('erreur');
      setMessage(
        `L’envoi a échoué. Écrivez-nous directement à ${site.email}, nous répondons sous 48 heures.`,
      );
    }
  }

  if (etat === 'ok') {
    return (
      <div className="formulaire__succes" role="status">
        <p className="h2">Bien reçu.</p>
        <p className="lede">
          Nous lisons chaque proposition. Si le sujet nous semble juste, nous revenons vers vous pour
          caler une demi-journée sur place.
        </p>
        <button type="button" className="bouton" onClick={() => setEtat('repos')}>
          Proposer un autre sujet
        </button>
      </div>
    );
  }

  return (
    <form className="formulaire" onSubmit={onSubmit} noValidate={false}>
      <div className="formulaire__grille">
        {CHAMPS.map((champ) => (
          <p key={champ.name} className="champ" data-large={champ.name === 'sujet' ? '' : undefined}>
            <label className="label champ__label" htmlFor={`champ-${champ.name}`}>
              {champ.label}
              {champ.required && <span aria-hidden="true"> *</span>}
            </label>
            <input
              id={`champ-${champ.name}`}
              name={champ.name}
              type={champ.type}
              required={champ.required}
              autoComplete={champ.autoComplete}
              className="champ__saisie"
            />
          </p>
        ))}

        <p className="champ champ--large">
          <label className="label champ__label" htmlFor="champ-message">
            Message
          </label>
          <textarea
            id="champ-message"
            name="message"
            rows={5}
            className="champ__saisie champ__saisie--zone"
            placeholder="Ce dont vous voulez parler, et où nous viendrions enregistrer."
          />
        </p>
      </div>

      <div className="formulaire__pied">
        <button type="submit" className="bouton bouton--plein" disabled={etat === 'envoi'}>
          {etat === 'envoi' ? 'Envoi…' : site.participate.cta}
          {etat !== 'envoi' && (
            <span className="fleche" aria-hidden="true">
              →
            </span>
          )}
        </button>
        <p className="meta formulaire__mention">
          Les champs marqués d’un astérisque sont obligatoires. Vos données servent uniquement à
          traiter votre proposition.
        </p>
      </div>

      <p className="formulaire__erreur" role="alert">
        {etat === 'erreur' ? message : ''}
      </p>
    </form>
  );
}
