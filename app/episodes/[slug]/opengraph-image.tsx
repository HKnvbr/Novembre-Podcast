import { ImageResponse } from 'next/og';
import { site } from '@/content/site';
import { getAllEpisodes, getEpisode, guestLine } from '@/lib/episodes';
import { formatDuration, formatEpisodeRef } from '@/lib/format';
import { CHAMP_ORANGE, OG_COULEURS as C, OG_TAILLE, OG_TYPE, chargerPolices, imageEnDataUri } from '@/lib/og';

/**
 * Carte de partage d'un épisode — 1200 × 630.
 *
 * Portage direct de la carte du fichier de charte : champ orange, numéro
 * d'épisode, l'identité « Derrière la marque / Client » en gros, la
 * présentation de l'invité, la durée — et le portrait à droite.
 *
 * Sur ce champ orange, c'est **l'encre** qui porte le texte : du blanc y
 * plafonne à 3,97:1. Le bleu nuit sert de contrepoint.
 *
 * Trois contraintes de Satori dictent la composition :
 *  - les dégradés doivent passer par `backgroundImage` ; dans le raccourci
 *    `background`, ils sont silencieusement ignorés ;
 *  - un élément positionné en absolu doit porter des dimensions explicites ;
 *  - `filter` n'existe pas, et des calques frères posés sur une <img> ne se
 *    peignent pas au-dessus d'elle.
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
            background: C.nuit,
            color: C.blanc,
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
          color: C.encre,
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

        {/* Portrait à droite, raccordé au champ par un dégradé bleu nuit */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: 440, height: 630, display: 'flex' }}>
          <img src={portrait} width={440} height={630} style={{ objectFit: 'cover' }} alt="" />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 440,
              height: 630,
              display: 'flex',
              backgroundImage:
                'linear-gradient(90deg, rgba(196,102,46,1) 0%, rgba(196,102,46,0.5) 22%, rgba(26,36,61,0.14) 62%, rgba(26,36,61,0.24) 100%)',
            }}
          />
        </div>

        {/* Bloc typographique */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '58px 62px',
            width: 800,
            height: '100%',
          }}
        >
          <div
            style={{
              fontSize: 19,
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            {`Épisode ${formatEpisodeRef(episode.episodeNumber)}`}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* L'identité de la charte : le média, puis le client */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Titre',
                fontSize: 52,
                fontWeight: 800,
                lineHeight: 1.04,
                letterSpacing: '-0.035em',
                textTransform: 'uppercase',
                marginBottom: 26,
              }}
            >
              <div style={{ display: 'flex' }}>
                <span>Der</span>
                <span style={{ display: 'flex', transform: 'scaleX(-1)' }}>r</span>
                <span>ière la marque</span>
              </div>
              <div style={{ display: 'flex' }}>{episode.guest.company}</div>
            </div>

            <div
              style={{
                fontSize: 27,
                fontWeight: 500,
                letterSpacing: '-0.008em',
                marginBottom: 14,
              }}
            >
              {guestLine(episode)}
            </div>

            <div
              style={{
                fontSize: 24,
                fontWeight: 400,
                letterSpacing: '-0.008em',
                color: C.nuit,
                maxWidth: 620,
              }}
            >
              {episode.title}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              color: C.nuit,
              borderTop: '1px solid rgba(18, 18, 18, 0.28)',
              paddingTop: 22,
              whiteSpace: 'nowrap',
            }}
          >
            <span>{`${site.url.replace('https://', '')}/${episode.slug}`}</span>
            <span>·</span>
            <span>{formatDuration(episode.duration)}</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
