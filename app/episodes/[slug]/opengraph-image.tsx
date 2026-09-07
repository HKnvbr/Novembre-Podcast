import { ImageResponse } from 'next/og';
import { site } from '@/content/site';
import { episodeIdentity, getAllEpisodes, getEpisode } from '@/lib/episodes';
import { formatDuration, formatEpisodeRef } from '@/lib/format';
import {
  CHAMP_ORANGE,
  OG_COULEURS as C,
  OG_TAILLE,
  OG_TYPE,
  VOILE_CREME,
  chargerPolices,
  imageEnDataUri,
} from '@/lib/og';

/**
 * Carte de partage d'un épisode — 1200 × 630.
 *
 * Portage de la carte du fichier de charte, à la composition près : le champ
 * orange, la carte arrondie posée dessus, la photographie à gauche sous le
 * logotype augmenté du nom du client, le panneau de texte à droite.
 *
 * Le panneau est plus sombre que le champ qui l'entoure, et ce n'est pas un
 * effet : du blanc sur l'orange de marque plafonne à 4,4:1, sur l'orange
 * assombri du fichier il atteint 6,5:1. Le dégradé est ce qui rend le bloc
 * lisible.
 *
 * Quatre contraintes de Satori dictent le reste :
 *  - les dégradés doivent passer par `backgroundImage` ; dans le raccourci
 *    `background`, ils sont silencieusement ignorés ;
 *  - un élément positionné en absolu doit porter des dimensions explicites,
 *    `inset: 0` seul ne peint rien ;
 *  - `filter` n'existe pas, et des calques frères posés sur une <img> ne se
 *    peignent pas au-dessus d'elle — d'où l'imbrication ;
 *  - un nœud de texte à plusieurs enfants lève une exception : chaque ligne est
 *    une chaîne assemblée en amont, sauf le R retourné qui a besoin de ses
 *    propres balises.
 *
 * Next lit `alt` de façon statique : il ne peut pas décrire un épisode en
 * particulier. Le texte reste donc générique — l'information est portée par
 * og:title.
 */

export const size = OG_TAILLE;
export const contentType = OG_TYPE;
export const alt = `${site.name} — carte de partage de l’épisode`;

export async function generateStaticParams() {
  const episodes = await getAllEpisodes();
  return episodes.map((episode) => ({ slug: episode.slug }));
}

/** Géométrie de la carte, en pixels — la composition de la planche. */
const CARTE = { x: 62, y: 74, largeur: 1076, hauteur: 482, rayon: 26 };
const VISUEL = 466;
const PANNEAU = CARTE.largeur - VISUEL;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episode = await getEpisode(slug);
  const fonts = await chargerPolices([400, 600, 800], [400, 500]);

  if (!episode) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: C.creme,
            color: C.nuit,
            fontFamily: 'Titre',
            fontSize: 78,
            fontWeight: 800,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
          }}
        >
          {site.name}
        </div>
      ),
      { ...size, fonts },
    );
  }

  const portrait = await imageEnDataUri(episode.coverImage.src);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: C.orange,
          fontFamily: 'Texte',
        }}
      >
        {/* Le champ orange de la charte */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: 'flex',
            backgroundImage: CHAMP_ORANGE,
          }}
        />

        {/* La carte */}
        <div
          style={{
            position: 'absolute',
            top: CARTE.y,
            left: CARTE.x,
            width: CARTE.largeur,
            height: CARTE.hauteur,
            display: 'flex',
            borderRadius: CARTE.rayon,
            overflow: 'hidden',
          }}
        >
          {/* ------------------------------------------------ la photographie */}
          <div style={{ position: 'relative', width: VISUEL, height: CARTE.hauteur, display: 'flex' }}>
            <img src={portrait} width={VISUEL} height={CARTE.hauteur} style={{ objectFit: 'cover' }} alt="" />

            {/* Voile crème, puis la typographie par-dessus — imbriquée, sinon
                Satori la peint sous l'image. */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: VISUEL,
                height: CARTE.hauteur,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 34,
                backgroundImage: VOILE_CREME,
                color: C.nuit,
              }}
            >
              {/* Le logotype absorbe le nom du client : troisième ligne. */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  fontFamily: 'Titre',
                  fontWeight: 800,
                  fontSize: 40,
                  lineHeight: 0.94,
                  letterSpacing: '-0.035em',
                  textTransform: 'uppercase',
                }}
              >
                <div style={{ display: 'flex' }}>
                  <span>Der</span>
                  <span style={{ display: 'flex', transform: 'scaleX(-1)' }}>r</span>
                  <span>ière</span>
                </div>
                <div style={{ display: 'flex' }}>la marque</div>
                <div style={{ display: 'flex', fontSize: 29, letterSpacing: '-0.02em' }}>
                  {episode.guest.company}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    background: C.panneau,
                    color: C.creme,
                    padding: '7px 12px',
                    fontSize: 16,
                    fontWeight: 500,
                    letterSpacing: '0.19em',
                    textTransform: 'uppercase',
                  }}
                >
                  {site.descriptor}
                </div>
                <div style={{ display: 'flex', fontSize: 21, fontWeight: 500 }}>
                  {`Avec ${episode.guest.name}`}
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------ le panneau */}
          <div
            style={{
              width: PANNEAU,
              height: CARTE.hauteur,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 22,
              padding: '46px 52px',
              background: C.panneau,
              color: C.blanc,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.78)',
              }}
            >
              {`Épisode ${formatEpisodeRef(episode.episodeNumber)}`}
            </div>

            <div
              style={{
                display: 'flex',
                fontFamily: 'Titre',
                fontSize: 46,
                fontWeight: 800,
                lineHeight: 1.04,
                letterSpacing: '-0.035em',
                textTransform: 'uppercase',
              }}
            >
              {episodeIdentity(episode)}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div
                style={{
                  fontSize: 19,
                  fontWeight: 500,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                }}
              >
                {`Avec ${episode.guest.name},`}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.78)',
                }}
              >
                {episode.guest.role}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 16,
                marginTop: 8,
                fontSize: 17,
                fontWeight: 400,
                color: 'rgba(255,255,255,0.78)',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{formatDuration(episode.duration)}</span>
              <span>·</span>
              <span>{`${site.url.replace('https://', '')}/${episode.slug}`}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
