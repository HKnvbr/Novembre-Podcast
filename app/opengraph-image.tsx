import { ImageResponse } from 'next/og';
import { site } from '@/content/site';
import { HALO_CREME, OG_COULEURS as C, OG_TAILLE, OG_TYPE, chargerPolices } from '@/lib/og';

/**
 * Carte de partage par défaut — home, à propos, participer, archive.
 *
 * Composition reprise du fichier de charte : la pochette y est claire, le
 * logotype bleu nuit posé sur un fond crème que réchauffe un halo terre cuite.
 * Suivent les deux mentions côte à côte — l'animateur et le descripteur.
 *
 * Le halo est nettement plus discret que son équivalent bleu nuit : sur un fond
 * clair, un aplat orange à la même opacité se voit dix fois plus.
 */

export const size = OG_TAILLE;
export const contentType = OG_TYPE;
export const alt = `${site.name} — ${site.descriptor}`;

export default async function Image() {
  const fonts = await chargerPolices([400, 800], [400, 500]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: C.creme,
          color: C.nuit,
          fontFamily: 'Texte',
        }}
      >
        {/* Halo orange — dimensions explicites, sinon Satori ne peint rien */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: 'flex',
            backgroundImage: HALO_CREME,
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '62px 66px',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 11, height: 11, borderRadius: 11, background: C.orange, display: 'flex' }} />
            <div
              style={{
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: '0.21em',
                textTransform: 'uppercase',
                color: C.orangeFonce,
              }}
            >
              {site.descriptor}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Titre' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 104,
                fontWeight: 800,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              <span>Der</span>
              <span style={{ display: 'flex', transform: 'scaleX(-1)' }}>r</span>
              <span>ière</span>
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 104,
                fontWeight: 800,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                lineHeight: 1.02,
              }}
            >
              la marque
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              borderTop: `1px solid rgba(29, 44, 62, 0.18)`,
              paddingTop: 24,
            }}
          >
            {/* « Avec Frédéric Cronenberger » — la ligne de la pochette. Le
                descripteur est déjà en haut de la carte : le répéter ici en
                faisait la seule mention lue deux fois. */}
            <div style={{ display: 'flex', gap: 9, fontSize: 26, lineHeight: 1.2 }}>
              <span style={{ color: C.plomb }}>Avec</span>
              <span style={{ color: C.nuit, fontWeight: 500 }}>{site.host.name}</span>
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 400,
                letterSpacing: '0.19em',
                textTransform: 'uppercase',
                color: C.plomb,
              }}
            >
              {site.url.replace('https://', '')}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
