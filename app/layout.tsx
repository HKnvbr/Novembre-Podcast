import type { Metadata, Viewport } from 'next';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { JsonLd } from '@/components/JsonLd';
import { Reveal } from '@/components/Reveal';
import { site } from '@/content/site';
import { jsonLdGraph, organizationSchema, seriesSchema } from '@/lib/schema';
import { texte, titre } from './fonts';
import './globals.css';
import './chrome.css';
import './pages.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.intro,
  applicationName: site.name,
  authors: [{ name: site.host.name }],
  creator: site.host.name,
  publisher: site.name,
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': [{ url: '/feed.xml', title: site.name }] },
  },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: site.locale,
    url: site.url,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#1a243d',
  colorScheme: 'dark',
};

/**
 * Pose `.js` sur <html> avant le premier rendu. Les animations d'apparition ne
 * masquent le contenu que si le JavaScript est réellement disponible.
 *
 * Le script s'exécute avant l'hydratation et modifie donc un attribut que React
 * a rendu côté serveur : d'où le `suppressHydrationWarning` sur <html>. C'est le
 * motif prévu pour ce cas — un script de préambule qui décide d'un état visuel
 * avant la première peinture. La suppression ne porte que sur cet élément.
 */
const MARQUEUR_JS = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.lang} className={`${titre.variable} ${texte.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MARQUEUR_JS }} />
      </head>
      <body>
        <div className="evitement">
          <a href="#contenu">Aller au contenu</a>
          <a href="#entete">Aller au menu</a>
          <a href="#pied">Aller au pied de page</a>
        </div>

        <Header />
        <main id="contenu">{children}</main>
        <Footer />

        <Reveal />
        <JsonLd data={jsonLdGraph(organizationSchema(), seriesSchema())} />
      </body>
    </html>
  );
}
