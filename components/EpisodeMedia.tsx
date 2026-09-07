'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Episode } from '@/content/types';
import { formatTimecode } from '@/lib/format';
import { waveform } from '@/lib/waveform';

/**
 * Bloc média d'un épisode : bascule audio / vidéo et lecteur.
 *
 * Composant client parce que la position de lecture est un état partagé entre
 * le bouton, l'onde et le compteur. Le reste de la page est rendu côté serveur.
 */

type Mode = 'audio' | 'video';

export function EpisodeMedia({ episode }: { episode: Episode }) {
  const aVideo = Boolean(episode.youtubeId);
  const aAudio = Boolean(episode.audioUrl);

  const [mode, setMode] = useState<Mode>(aAudio ? 'audio' : 'video');
  const [videoActive, setVideoActive] = useState(false);

  const audio = useRef<HTMLAudioElement>(null);
  const [enLecture, setEnLecture] = useState(false);
  const [position, setPosition] = useState(0);
  const [mediaDuree, setMediaDuree] = useState(0);

  const barres = useMemo(() => waveform(episode.slug), [episode.slug]);

  /**
   * Le prototype tourne sur un fichier audio de démonstration de 40 s alors que
   * les épisodes annoncent ~55 min. La piste courte est donc étirée sur la durée
   * annoncée, pour que le compteur et la barre de progression racontent la même
   * chose que le reste de la page. Avec un vrai fichier, `echelle` vaut 1 et
   * tout est exact.
   */
  const echelle =
    mediaDuree > 0 && mediaDuree < episode.duration * 0.9 ? episode.duration / mediaDuree : 1;

  const duree = mediaDuree > 0 ? mediaDuree * echelle : episode.duration;
  const affichee = position * echelle;
  const progression = duree > 0 ? Math.min(1, affichee / duree) : 0;

  const seek = useCallback(
    (secondesAffichees: number) => {
      const el = audio.current;
      if (!el || !Number.isFinite(el.duration)) return;
      el.currentTime = Math.max(0, Math.min(el.duration - 0.05, secondesAffichees / echelle));
      setPosition(el.currentTime);
    },
    [echelle],
  );

  const basculer = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  }, []);

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    const onTime = () => setPosition(el.currentTime);
    const onMeta = () => setMediaDuree(Number.isFinite(el.duration) ? el.duration : 0);
    const onPlay = () => setEnLecture(true);
    const onPause = () => setEnLecture(false);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('durationchange', onMeta);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onPause);
    if (el.readyState >= 1) onMeta();
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('durationchange', onMeta);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onPause);
    };
  }, []);

  return (
    <div className="media">
      {/* Groupe de boutons pressés, pas un motif ARIA « tablist » : sans
          panneaux ni navigation aux flèches, des rôles d'onglets annonceraient
          au lecteur d'écran un comportement que le composant n'a pas. */}
      {aAudio && aVideo && (
        <div className="media__bascule" role="group" aria-label="Format de lecture">
          {(['audio', 'video'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              className={`media__onglet label${mode === m ? ' media__onglet--actif' : ''}`}
              onClick={() => setMode(m)}
            >
              {m === 'audio' ? 'Écouter' : 'Regarder'}
            </button>
          ))}
        </div>
      )}

      {mode === 'audio' && aAudio && (
        <div className="lecteur" data-lecture={enLecture || undefined}>
          {/* preload="metadata" : on veut la durée, pas le fichier. */}
          <audio ref={audio} src={episode.audioUrl} preload="metadata" />

          <button
            type="button"
            className="lecteur__bouton"
            onClick={basculer}
            aria-label={enLecture ? 'Mettre en pause' : 'Lancer la lecture'}
          >
            <span className="lecteur__glyphe" aria-hidden="true">
              {enLecture ? '❙❙' : '▶'}
            </span>
            <span className="lecteur__intitule label">
              {enLecture ? 'En lecture' : 'Écouter l’épisode'}
            </span>
          </button>

          <div className="lecteur__onde">
            <div className="lecteur__barres" aria-hidden="true">
              {barres.map((h, i) => (
                <span
                  key={i}
                  className="lecteur__barre"
                  data-jouee={i / barres.length <= progression || undefined}
                  style={{ height: `${Math.round(h * 100)}%` }}
                />
              ))}
            </div>
            <input
              type="range"
              className="lecteur__curseur"
              min={0}
              max={Math.max(1, Math.round(duree))}
              step={1}
              value={Math.round(affichee)}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Position dans l’épisode"
              aria-valuetext={`${formatTimecode(affichee)} sur ${formatTimecode(duree)}`}
            />
          </div>

          <p className="lecteur__temps tabulaire">
            <span>{formatTimecode(affichee)}</span>
            <span className="lecteur__separateur" aria-hidden="true">
              /
            </span>
            <span className="lecteur__total">{formatTimecode(duree)}</span>
          </p>

          <button
            type="button"
            className="lecteur__recul label"
            onClick={() => seek(Math.max(0, affichee - 15))}
          >
            −15 s
          </button>
        </div>
      )}

      {mode === 'video' && aVideo && (
        <VideoFacade
          youtubeId={episode.youtubeId as string}
          poster={episode.coverImage.src}
          alt={episode.coverImage.alt}
          title={`${episode.guest.name} — ${episode.title}`}
          active={videoActive}
          onActivate={() => setVideoActive(true)}
        />
      )}
    </div>
  );
}

/**
 * Façade YouTube : l'iframe n'est créée qu'au clic. Avant ça, la page ne charge
 * aucun script tiers — c'est meilleur pour la performance et pour la vie privée
 * du visiteur. Domaine `youtube-nocookie`.
 */
function VideoFacade({
  youtubeId,
  poster,
  alt,
  title,
  active,
  onActivate,
}: {
  youtubeId: string;
  poster: string;
  alt: string;
  title: string;
  active: boolean;
  onActivate: () => void;
}) {
  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`;

  if (!active) {
    return (
      <button type="button" className="video video--facade" onClick={onActivate}>
        <span className="photo photo--braise video__image">
          <Image src={poster} alt={alt} width={1600} height={900} sizes="(max-width: 899px) 100vw, 66vw" />
        </span>
        <span className="video__lecture">
          <span className="video__glyphe" aria-hidden="true">
            ▶
          </span>
          <span className="label">Voir l’épisode</span>
        </span>
      </button>
    );
  }

  return (
    <div className="video">
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
