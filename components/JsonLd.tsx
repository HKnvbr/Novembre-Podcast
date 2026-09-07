/** Injecte un graphe JSON-LD. Un seul <script> par page. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Les données proviennent du contenu du site, jamais d'une saisie utilisateur.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
