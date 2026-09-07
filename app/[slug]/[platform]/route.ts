import { NextResponse } from 'next/server';
import { normalizePlatform, resolveEpisode, resolveTarget } from '@/lib/episodes';

/**
 * Redirections courtes — `derriere-la-marque.com/[slug]/[plateforme]`.
 *
 *   /nord-cosmetics/spotify  → l'URL Spotify du moment
 *   /nord-cosmetics/youtube  → la vidéo
 *   /nord-cosmetics/apple    → Apple Podcasts
 *   /nord-cosmetics/site     → le site du client
 *   /nord-cosmetics/linkedin → le profil de l'invité
 *
 * Deux décisions importantes :
 *
 * 1. **307, pas 308.** La destination est faite pour changer — un flux qu'on
 *    remigre, une plateforme qu'on ajoute. Un permanent serait mis en cache par
 *    les navigateurs et les lecteurs de QR codes, et gèlerait une URL qu'on veut
 *    précisément garder mobile.
 * 2. **`no-store`.** Même raison : une modification dans les données doit
 *    prendre effet au prochain clic, pas au prochain vidage de cache.
 *
 * Conséquence : un QR code imprimé, un lien dans un support commercial ou une
 * publication LinkedIn restent valides indéfiniment, quelles que soient les
 * plateformes de diffusion.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; platform: string }> },
) {
  const { slug, platform } = await params;

  const episode = await resolveEpisode(slug);
  if (!episode) {
    return NextResponse.json({ erreur: 'Épisode inconnu.' }, { status: 404 });
  }

  const cible = normalizePlatform(platform);
  if (!cible) {
    return NextResponse.json({ erreur: 'Destination inconnue.' }, { status: 404 });
  }

  const destination = resolveTarget(episode, cible);
  if (!destination) {
    // La destination n'est pas encore renseignée : on renvoie sur la page de
    // l'épisode plutôt que sur une erreur. Le visiteur trouve toujours l'écoute.
    return NextResponse.redirect(new URL(`/episodes/${episode.slug}`, _request.url), {
      status: 307,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  return NextResponse.redirect(destination, {
    status: 307,
    headers: { 'Cache-Control': 'no-store' },
  });
}
