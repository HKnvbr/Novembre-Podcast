/** Formatage éditorial — durées, dates, timestamps. */

/** `3247` → `54 min` (durée d'un épisode, affichage courant). */
export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.round((total % 3600) / 60);
  if (h > 0) return m > 0 ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`;
  return `${m} min`;
}

/** `3247` → `54:07` (compteurs du lecteur). */
export function formatTimecode(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  return h > 0
    ? `${h}:${mm}:${String(s).padStart(2, '0')}`
    : `${mm.padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** `3247` → `PT54M7S` (Schema.org, RSS iTunes). */
export function formatIsoDuration(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s ? `${s}S` : ''}` || 'PT0S';
}

/** `3247` → `54:07` zéro-padded sur les heures (balise itunes:duration). */
export function formatClock(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

const LONG_DATE = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const SHORT_DATE = new Intl.DateTimeFormat('fr-FR', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** `2026-08-19` → `19 août 2026`. */
export function formatDate(iso: string): string {
  return LONG_DATE.format(new Date(iso));
}

/** `2026-08-19` → `août 2026`. */
export function formatMonth(iso: string): string {
  return SHORT_DATE.format(new Date(iso));
}

/** `1` → `01` (colonne tabulaire de l'archive, où l'alignement compte). */
export function formatEpisodeNumber(n: number): string {
  return String(n).padStart(2, '0');
}

/** `6` → `#6` (numérotation en prose, comme dans le fichier de charte). */
export function formatEpisodeRef(n: number): string {
  return `#${n}`;
}
