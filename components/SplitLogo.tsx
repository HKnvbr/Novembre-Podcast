/**
 * Le logotype à l'échelle du cadre, révélé lettre à lettre.
 *
 * Le troisième R reste retourné pendant toute l'animation : la classe `.miroir`
 * porte le `scaleX(-1)`, et `globals.css` compose le miroir avec la translation
 * du volet plutôt que de l'écraser.
 *
 * Composant serveur : aucun JavaScript envoyé au client.
 */
const MOT_1 = ['D', 'e', 'r', 'r', 'i', 'è', 'r', 'e'];
const MOT_2 = ['l', 'a', ' ', 'm', 'a', 'r', 'q', 'u', 'e'];

/** Index de la lettre retournée dans le premier mot. */
const MIROIR = 3;

/**
 * `lignes` :
 *  - 2 : le lockup de la charte, deux lignes empilées (couverture, pied de page)
 *  - 1 : une seule ligne pleine largeur, pour le bas du hero — deux lignes à
 *        cette échelle ne tiendraient pas dans la hauteur de fenêtre
 */
export function SplitLogo({
  step = 34,
  lignes = 2,
  className,
}: {
  step?: number;
  lignes?: 1 | 2;
  className?: string;
}) {
  let compteur = 0;
  const groupes = lignes === 1 ? [[...MOT_1, ' ', ...MOT_2]] : [MOT_1, MOT_2];

  return (
    <span className={className} data-reveal-letters="pending" aria-label="Derrière la marque">
      {groupes.map((lettres, ligne) => (
        <span className="signe__ligne" key={ligne}>
          {lettres.map((lettre, i) => {
            const delai = compteur++ * step;
            const retournee = ligne === 0 && i === MIROIR;
            return (
              <span
                key={`${ligne}-${i}`}
                className={`lettre${retournee ? ' miroir' : ''}`}
                style={{ transitionDelay: `${delai}ms` }}
                aria-hidden="true"
              >
                {lettre === ' ' ? ' ' : lettre}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
