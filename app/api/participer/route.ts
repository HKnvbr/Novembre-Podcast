import { NextResponse } from 'next/server';

/**
 * Réception des propositions d'épisode.
 *
 * Le prototype se contente de valider et de journaliser : brancher ici l'outil
 * de l'équipe (une API transactionnelle, un CRM, ou un simple envoi vers la
 * boîte partagée). La validation reste côté serveur dans tous les
 * cas : le contrôle navigateur ne protège de rien.
 */

const OBLIGATOIRES = ['nom', 'entreprise', 'fonction', 'email', 'sujet'] as const;
const MAX = 4000;

export async function POST(request: Request) {
  let charge: unknown;
  try {
    charge = await request.json();
  } catch {
    return NextResponse.json({ erreur: 'Corps de requête illisible.' }, { status: 400 });
  }

  if (typeof charge !== 'object' || charge === null) {
    return NextResponse.json({ erreur: 'Format inattendu.' }, { status: 400 });
  }

  const data = charge as Record<string, unknown>;
  const champs: Record<string, string> = {};

  for (const clef of OBLIGATOIRES) {
    const valeur = data[clef];
    if (typeof valeur !== 'string' || valeur.trim().length === 0) {
      return NextResponse.json({ erreur: `Champ manquant : ${clef}.` }, { status: 422 });
    }
    champs[clef] = valeur.trim().slice(0, MAX);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(champs.email ?? '')) {
    return NextResponse.json({ erreur: 'Adresse email invalide.' }, { status: 422 });
  }

  const message = typeof data.message === 'string' ? data.message.trim().slice(0, MAX) : '';

  // TODO — remplacer par l'envoi réel (API transactionnelle ou CRM).
  console.info('[podcast] proposition reçue', { ...champs, message: message.length });

  return NextResponse.json({ ok: true }, { status: 202 });
}
