/**
 * Silhouette d'onde déterministe, dérivée du slug de l'épisode.
 *
 * Volontairement pas d'analyse audio réelle : elle imposerait de charger le
 * fichier entier avant de dessiner quoi que ce soit, pour un gain purement
 * décoratif. Une silhouette stable et propre à chaque épisode remplit le même
 * rôle éditorial pour un coût nul.
 */
export function waveform(seed: string, bars = 96): number[] {
  // xorshift32 amorcé par le slug — même épisode, même silhouette, toujours.
  let state = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    state ^= seed.charCodeAt(i);
    state = Math.imul(state, 16777619);
  }

  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 1000) / 1000;
  };

  return Array.from({ length: bars }, (_, i) => {
    // Enveloppe : montée au début, retombée à la fin — l'allure d'une
    // conversation, pas d'un bruit blanc.
    const p = i / (bars - 1);
    const enveloppe = 0.45 + 0.55 * Math.sin(Math.PI * Math.min(1, p * 1.08));
    const grain = 0.35 + 0.65 * next();
    return Math.max(0.1, Math.min(1, enveloppe * grain));
  });
}
