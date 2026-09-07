'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { site } from '@/content/site';
import { Wordmark } from './Wordmark';

/**
 * En-tête minimal. Deux états : posé sur le hero (transparent, voile discret)
 * et décollé (fond noir + filet). Plus de bascule clair/sombre : le site est
 * noir de bout en bout.
 */
export function Header() {
  const pathname = usePathname();
  const [decolle, setDecolle] = useState(false);
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    const onScroll = () => setDecolle(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOuvert(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = ouvert ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [ouvert]);

  useEffect(() => {
    if (!ouvert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOuvert(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ouvert]);

  const actif = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      id="entete"
      className="entete"
      data-decolle={decolle || undefined}
      data-ouvert={ouvert || undefined}
    >
      <div className="entete__barre shell">
        <Link href="/" className="entete__marque" aria-label={`${site.name} — accueil`}>
          <Wordmark />
        </Link>

        <nav className="entete__nav" aria-label="Navigation principale">
          <ul>
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`lien label${actif(item.href) ? ' lien--actif' : ''}`}
                  aria-current={actif(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/episodes" className="bouton entete__ecouter">
                Écouter
              </Link>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="entete__bascule label"
          aria-expanded={ouvert}
          aria-controls="menu-mobile"
          onClick={() => setOuvert((v) => !v)}
        >
          {ouvert ? 'Fermer' : 'Menu'}
        </button>
      </div>

      <div id="menu-mobile" className="menu braise braise--basse" hidden={!ouvert}>
        <nav aria-label="Navigation mobile">
          <ul>
            {site.nav.map((item, i) => (
              <li key={item.href} style={{ ['--i' as string]: i }}>
                <Link href={item.href} className="menu__lien display">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="menu__pied meta">
          {site.name} — avec {site.host.name}
        </p>
      </div>
    </header>
  );
}
