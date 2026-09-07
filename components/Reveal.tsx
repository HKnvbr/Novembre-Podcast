'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Moteur d'apparition au scroll.
 *
 * Un seul IntersectionObserver pour toute la page, qui bascule les attributs
 * `data-reveal*` de « pending » à « in ». Le CSS fait le reste. Aucune
 * bibliothèque d'animation, aucun re-render React : les éléments animés restent
 * des composants serveur.
 *
 * Un MutationObserver double l'IntersectionObserver, et il est indispensable :
 * les listes filtrables (archive) réinsèrent des éléments après le montage.
 * Sans lui, ces nœuds naissent en « pending », ne sont jamais observés, et
 * restent invisibles pour toujours.
 *
 * Sans JavaScript, la classe `.js` n'est jamais posée sur <html> et le contenu
 * s'affiche normalement — l'animation est un bonus, pas une condition.
 */
const SELECTEUR = '[data-reveal], [data-reveal-mask], [data-reveal-letters]';
const ATTRIBUTS = ['data-reveal', 'data-reveal-mask', 'data-reveal-letters'] as const;

export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const montrer = (el: HTMLElement) => {
      for (const attr of ATTRIBUTS) {
        if (el.getAttribute(attr) === 'pending') el.setAttribute(attr, 'in');
      }
    };

    const observer = reduit
      ? null
      : new IntersectionObserver(
          (entrees) => {
            for (const entree of entrees) {
              if (!entree.isIntersecting) continue;
              montrer(entree.target as HTMLElement);
              observer?.unobserve(entree.target);
            }
          },
          // Déclenchement légèrement avant l'entrée dans le viewport : l'élément
          // est déjà en place quand l'œil arrive dessus.
          { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
        );

    const prendreEnCharge = (el: HTMLElement) => {
      if (reduit) {
        montrer(el);
        return;
      }
      // Ce qui est déjà à l'écran n'a pas à attendre le scroll.
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) montrer(el);
      else observer?.observe(el);
    };

    const balayer = (racine: ParentNode) => {
      if (racine instanceof HTMLElement && racine.matches(SELECTEUR)) prendreEnCharge(racine);
      racine.querySelectorAll<HTMLElement>(SELECTEUR).forEach(prendreEnCharge);
    };

    balayer(document);

    // Les nœuds ajoutés après coup — filtres d'archive, contenus conditionnels —
    // doivent rejoindre le dispositif, sinon ils restent masqués par le CSS.
    const mutations = new MutationObserver((liste) => {
      for (const mutation of liste) {
        for (const noeud of mutation.addedNodes) {
          if (noeud.nodeType === Node.ELEMENT_NODE) balayer(noeud as Element);
        }
      }
    });

    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
