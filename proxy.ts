import { NextResponse, type NextRequest } from 'next/server';
import { enAttente } from '@/lib/coming-soon';

/**
 * Fermeture du site pendant la page d'attente (voir `lib/coming-soon.ts`).
 *
 * Seule la home répond, et c'est elle qui affiche la page d'attente. Toute
 * autre adresse — épisodes, URLs courtes, flux RSS, archive — y est renvoyée
 * par une redirection temporaire : un QR code imprimé trop tôt mène quand même
 * quelque part, et rien n'est transmis aux moteurs comme définitif.
 *
 * Restent ouverts les fichiers dont la page d'attente a besoin. Les ressources
 * de `_next` sont écartées par le `matcher`, sans passer par ici.
 */
const OUVERTS = new Set(['/', '/robots.txt', '/sitemap.xml', '/icon.png', '/opengraph-image']);

export function proxy(request: NextRequest) {
  if (!enAttente || OUVERTS.has(request.nextUrl.pathname)) return NextResponse.next();

  // Une requête qui n'est pas une lecture — l'envoi du formulaire de
  // participation, par exemple — n'a pas de page à suivre.
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
