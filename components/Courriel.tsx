'use client';

import { useEffect, useState, type ReactNode } from 'react';

/**
 * Lien vers une adresse électronique qui n'est écrite en clair ni dans le HTML
 * ni dans la charge utile React, pour échapper aux robots qui collectent les
 * adresses. Seuls le nom et le domaine y figurent, séparément ; l'adresse est
 * assemblée dans le navigateur, au montage, avec le `mailto:`.
 *
 * `afficher` : le lien montre l'adresse elle-même. Avant le montage, ou sans
 * JavaScript, il en montre un repli dont l'arobase est dessinée en CSS
 * (`.arobase`), puis la vraie adresse, que l'on peut copier.
 *
 * La copie statique de la page d'attente fait la même chose dans `script.js`.
 */
export function Courriel({
  nom,
  domaine,
  sujet,
  afficher = false,
  className,
  children,
}: {
  nom: string;
  domaine: string;
  /** Objet du message, prérempli. */
  sujet?: string;
  afficher?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const [adresse, setAdresse] = useState<string | null>(null);

  useEffect(() => {
    setAdresse(`${nom}@${domaine}`);
  }, [nom, domaine]);

  const href = adresse
    ? `mailto:${adresse}${sujet ? `?subject=${encodeURIComponent(sujet)}` : ''}`
    : undefined;

  return (
    <a href={href} className={className}>
      {afficher
        ? (adresse ?? (
            <>
              {nom}
              <span className="arobase" />
              {domaine}
            </>
          ))
        : children}
    </a>
  );
}
