import { ImageResponse } from 'next/og';
import { site } from '@/content/site';
import { HALO_NUIT, OG_COULEURS as C, OG_TAILLE, OG_TYPE, chargerPolices } from '@/lib/og';

/**
 * Carte de partage par défaut — home, à propos, participer, archive.
 *
 * Composition reprise du fichier de charte : fond bleu nuit, halo orange, le
 * logotype avec son R retourné, puis les deux mentions côte à côte —
 * l'animateur et le descripteur — comme sur la pochette.
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
          background: C.nuit,
          color: C.blanc,
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
            backgroundImage: HALO_NUIT,
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
                color: C.orangeTexte,
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
              borderTop: `1px solid rgba(176, 192, 208, 0.24)`,
              paddingTop: 24,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: 25, lineHeight: 1.2 }}>
              <span style={{ color: C.blanc }}>{site.host.name}</span>
              <span style={{ color: C.orangeTexte }}>{site.descriptor}</span>
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 400,
                letterSpacing: '0.19em',
                textTransform: 'uppercase',
                color: C.brumeSourde,
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
