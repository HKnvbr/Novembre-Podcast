# derriere-la-marque.com

**Derrière la marque — le podcast.** Avec Frédéric Cronenberger.
Next.js 16 (App Router), TypeScript, React 19, CSS moderne.
Aucune bibliothèque d'animation, aucun script tiers au chargement.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
npm run typecheck
```

---

## 1. Le concept

Le site n'est pas un catalogue d'écoute, c'est **le propriétaire des adresses du
média**. Chaque épisode a une URL permanente sur `derriere-la-marque.com` : c'est
elle qu'on imprime, qu'on encode en QR code, qu'on poste sur LinkedIn. Les
plateformes de diffusion sont des destinations, pas des adresses.

Le podcast se déplace : chaque épisode est enregistré sur place, dans
l'entreprise de l'invité.

### Pistes de wording

La promesse active est dans [`content/site.ts`](content/site.ts)
(`site.tagline`), avec les alternatives travaillées juste en dessous
(`taglineAlternatives`) :

| | |
|---|---|
| **retenue** | On va enregistrer là où la marque se fabrique. |
| | Derrière chaque marque, quelqu'un qui décide. On va lui parler. |
| | Ce qu'une marque ne met pas dans sa communication. |
| | Pas de studio. On vient chez vous, et on allume le micro. |
| | Une heure derrière la façade. |
| | Le micro se déplace. Les décisions se racontent sur place. |

Même chose pour la CTA de participation (`site.participate.titleAlternatives`).
Changer de promesse = éditer une chaîne dans un fichier.

---

## 2. La direction artistique

Relevée directement sur le deck **DLM** (Figma, nœuds `2874:46` → `2874:100`) —
pas approchée à l'œil.

### Typographie — deux familles

La charte en déclare deux, toutes deux Pangram Pangram et sous licence
commerciale, donc **non embarquées** :

| Rôle | Police de la charte | Substitut libre embarqué |
|---|---|---|
| Logotype et titres | **PP Neue Machina** | **Sora** — même ADN géométrique à courbes carrées, jusqu'à 800 |
| Noms et texte courant | **PP Neue Montreal** | **Instrument Sans** — néo-grotesque de même largeur étroite |

Les substituts ont été choisis en rendant les candidats côte à côte contre les
planches typographiques du fichier, pas au jugé. Les noms sous licence sont
déclarés **en premier** dans les piles :

```css
body { font-family: 'PP Neue Montreal', var(--font-texte), system-ui, sans-serif; }
h1, .display, .mega, .logo__nom {
  font-family: 'PP Neue Machina', var(--font-titre), system-ui, sans-serif;
}
```

**Pour passer en production avec les vraies polices :** déposer les `.woff2` sous
licence dans `assets/fonts`, les déclarer dans [`app/fonts.ts`](app/fonts.ts), et
générer les instances statiques pour les cartes de partage (voir §7). Rien
d'autre à changer.

### Palette

| Token | Valeur | Usage | Contraste |
|---|---|---|---|
| `--nuit` | `#1a243d` | fond dominant | — |
| `--nuit-profond` | `#141b2e` | alternance de section | — |
| `--nuit-haute` | `#232e4c` | encarts, lecteur, champs | — |
| `--blanc` | `#ffffff` | titres | 15,4:1 sur nuit |
| `--brume` | `#b0c0d0` | texte courant et méta | 8,3:1 |
| `--brume-sourde` | `#8490a4` | tertiaire | 4,8:1 |
| `--orange` | `#c4662e` | aplats, points, filets — **graphique** | 3,88:1 |
| `--orange-texte` | `#d17946` | texte accentué sur bleu nuit | 4,79:1 |
| `--orange-clair` | `#e08a55` | petites capitales espacées | 5,82:1 |
| `--encre` | `#121212` | logotype sur blanc, texte **sur** le champ orange | 4,7 → 5,8:1 |

Les valeurs sont relevées **au pixel sur les planches du fichier** — fond
`#1A243D`, texte `#B0C0D0`, secondaire `#8490A4`, champ orange `#C4662E` →
`#D17946`.

Trois valeurs d'orange, et c'est le contraste qui les impose : `#C4662E` est la
couleur de marque mais plafonne à **3,88:1** sur bleu nuit — assez pour un point
ou un filet (seuil 3:1), pas pour du texte. `#D17946` atteint 4,79:1 et porte
donc les mots ; `#E08A55` monte à 5,82:1 pour les petites capitales espacées, où
la finesse du trait mange du contraste.

Symétriquement, sur le champ orange c'est **l'encre** qui porte le texte : du
blanc y plafonne à 3,97:1.

Trois valeurs du rouge, et c'est une nécessité mesurée : `#e92305` est la couleur
de marque et passe AA sur noir (4,71:1), mais plafonne à **4,46:1** sous du blanc
— insuffisant pour un bouton plein. `#e01f04`, imperceptiblement plus dense,
atteint 4,81:1 et ne sert que de surface.

### Les deux registres

La charte alterne deux surfaces, et le site fait de même :

- **Le bleu nuit**, dominant, avec un halo orange discret — classe `.braise`
  (variantes `.braise--basse`, `.braise--gauche`), et `.surface` pour assombrir
  d'un cran une section sans changer de registre.
- **Le champ orange plein** — classe `.brasier`, qui reprend la carte du
  fichier de charte. Elle bascule les jetons de contexte (`--fond`, `--texte`,
  `--texte-faible`, `--regle`, `--filet-appuye`), et le texte y passe en encre.

**Le site est aujourd'hui bleu nuit de bout en bout** : `.brasier` est définie,
complète et testée, mais appliquée nulle part dans les pages — elle sert en
revanche de fond aux cartes de partage d'épisode. Colorer une section revient à
lui ajouter la classe : tout suit, y compris les filets de formulaire, le bouton
plein et le contour de focus.

La classe `.bandes` porte un troisième motif, disponible et non utilisé.

Le voile posé sur les photographies est lui aussi en bleu nuit, pas en noir :
un noir pur creusait un trou dans la page.

### Les libellés

Le fichier de charte fixe deux tournures, portées par
[`lib/episodes.ts`](lib/episodes.ts) :

- `episodeIdentity()` → **« Derrière la marque / Café Reck »** — le média, puis
  le client. Elle sert là où le contexte ne dit pas déjà de quel média il
  s'agit : carte de partage, pochette, publication. Sur le site, l'en-tête porte
  déjà le logotype, la répéter dans chaque hero serait redondant.
- `guestLine()` → **« Il y a Thomas Riegert, artisan torréfacteur »** — la voix
  du podcast. On ne dit pas « avec », on dit « il y a ». La fonction est
  décapitalisée dans la phrase, sauf sigles et noms propres.

Conséquence sur la hiérarchie : **le client mène**, l'invité suit. C'est le nom
qu'on reconnaît dans une liste ou un fil, et c'est l'ordre des pochettes du
fichier.

Le descripteur du logotype est **« Podcast Business »**.

### Le logotype

**DERᴙIÈRE LA MARQUE** — le geste de la marque est le **troisième R, retourné**.
Dessiné en typographie, jamais en image : il reste net à toute taille et hérite
de la couleur de son contexte.

- [`components/Wordmark.tsx`](components/Wordmark.tsx) — version barre de
  navigation et version lockup (avec micro + descripteur)
- [`components/SplitLogo.tsx`](components/SplitLogo.tsx) — version à l'échelle du
  cadre, révélée lettre à lettre ; le miroir est composé **avec** la translation
  du volet, pas écrasé par elle
- [`components/MicroIcon.tsx`](components/MicroIcon.tsx) — l'icône micro,
  tracés repris tels quels du nœud Figma `2874:173`, peinte en `currentColor`

### Photographie

La charte présente ses images **en couleur naturelle** — cuir fauve, jean,
lumière du jour. Le traitement se limite donc à un léger appui de contraste et
une densité un peu réduite pour que la typographie tienne par-dessus. Ni
désaturation ni sépia : c'était le registre de la charte précédente.

```
image → voile bleu nuit (lisibilité du texte) → lumière orange (par-dessus le voile)
```

L'ordre compte : dans l'autre sens, le voile éteignait la couleur. Le voile est
en deux dégradés — un latéral garantit une colonne sombre à gauche, là où vit la
typographie, ce qui rend la lisibilité indépendante de la photo fournie.

### Interdits tenus

Aucun `border-radius` (sauf le point ON AIR et les pastilles de lecture,
circulaires par nature), aucun dégradé décoratif hors les halos de la charte,
aucune ombre, aucun logotype de plateforme, aucune icône hors le micro de marque
et les flèches typographiques.

---

## 3. Arborescence

```
/                            home — dernier épisode, promesse, liens, archive
/episodes                    archive filtrable par rubrique
/episodes/[slug]             page de référence de l'épisode   ← canonique
/a-propos                    le principe, puis l'animateur
/participer                  déroulé + formulaire de proposition

/[slug]                      URL courte  → 308 vers /episodes/[slug]
/[slug]/[plateforme]         redirection courte → 307 vers la destination
/episodes/[slug]/qr          QR code SVG
/episodes/[slug]/qr.png      QR code PNG 1200 px, en pièce jointe
/episodes/[slug]/opengraph-image   carte de partage 1200 × 630, générée
/opengraph-image             carte de partage par défaut
/feed.xml                    flux RSS podcast (RSS 2.0 + iTunes + podcast:)
/sitemap.xml  /robots.txt  /icon.svg
/api/participer              réception du formulaire (POST)
```

48 routes pré-rendues au build. Seules les redirections de plateforme et l'API
sont dynamiques — parce qu'elles doivent l'être.

---

## 4. La gestion des URLs

C'est le point structurant du projet.

### Adresse de communication

```
derriere-la-marque.com/nord-cosmetics    → 308 → /episodes/nord-cosmetics
derriere-la-marque.com/nord              → 308 → /episodes/nord-cosmetics
```

Un épisode déclare son `slug` **et** ses `aliases`. Un alias ne meurt jamais : un
flyer imprimé avec `/nord` reste valide après un changement de slug canonique.
Une seule page est indexée — la canonique — et le `<link rel="canonical">` le dit.

### Redirections courtes

```
derriere-la-marque.com/nord-cosmetics/spotify   → l'URL Spotify du moment
                                       /apple   → Apple Podcasts
                                       /youtube → la vidéo   (alias : /yt, /video)
                                       /deezer  /amazon  /castbox
                                       /site    → le site du client
                                       /linkedin→ le profil de l'invité
                                       /rss     → le flux
```

Deux décisions volontaires dans
[`app/[slug]/[platform]/route.ts`](app/%5Bslug%5D/%5Bplatform%5D/route.ts) :

- **307, pas 308.** La destination est *faite* pour changer. Un permanent serait
  mis en cache par les navigateurs et les lecteurs de QR codes, et gèlerait
  précisément l'URL qu'on veut garder mobile.
- **`Cache-Control: no-store`.** Une modification dans les données prend effet au
  prochain clic, pas au prochain vidage de cache.

Conséquence : on peut remigrer tout l'hébergement audio sans réimprimer un seul
support. Et les blocs « Écouter sur » de l'interface pointent eux-mêmes sur ces
URLs courtes — la mesure d'audience reste chez nous.

Si une destination n'est pas encore renseignée, la route renvoie sur la page de
l'épisode plutôt que sur une erreur : le visiteur trouve toujours l'écoute.

### QR codes

Générés côté serveur, statiquement, à partir de `vanityUrl(episode)` — **jamais**
d'une URL Spotify ou YouTube. Le SVG est intégré dans la page épisode (fond
transparent, il s'intègre à la maquette sans cadre blanc) ; le PNG 1200 px se
télécharge en un clic pour l'impression. Correction d'erreur niveau M (~15 %), le
bon compromis pour un support qui peut être plié ou sali.

---

## 5. Données et CMS

```
content/types.ts       le modèle, typé et commenté
content/episodes.ts    les 6 épisodes de démonstration
content/site.ts        wording de surface, animateur, navigation, plateformes
lib/episodes.ts        ← la seule porte entre les pages et le contenu
```

**Ajouter un épisode = ajouter un objet dans `content/episodes.ts`.** Rien
d'autre. Le tri, la numérotation, les voisins, le flux RSS, le sitemap, la carte
de partage, le QR code et les redirections courtes en découlent.

Toutes les fonctions de `lib/episodes.ts` sont **asynchrones**, y compris celles
qui n'en ont pas besoin aujourd'hui. C'est délibéré : brancher Sanity, Payload,
Strapi ou Contentful revient à remplacer le corps de ce fichier par des requêtes
réseau. Les types, les composants et les pages ne bougent pas. Le domaine
d'assets du CMS se déclare dans `next.config.ts` (`images.remotePatterns`, ligne
déjà commentée).

`published: false` sur un épisode le retire des listes, du flux et du sitemap
sans supprimer sa page — utile pour préparer une publication.

---

## 6. SEO et partage

- `<title>` propre à chaque épisode, portant **le nom de l'invité** — c'est lui
  qui déclenche le clic dans un fil, pas le titre seul.
- `<link rel="canonical">` toujours sur `/episodes/[slug]`, quelle que soit
  l'adresse d'entrée.
- Open Graph + Twitter/X `summary_large_image`.
- **Schema.org** : `PodcastSeries` + `Organization` + `Person` (l'animateur) sur
  tout le site ; `PodcastEpisode` (avec `AudioObject`, `VideoObject`, l'invité en
  `Person`/`worksFor`) + `BreadcrumbList` sur chaque épisode.
- `sitemap.xml` : les URLs courtes en sont **volontairement absentes** — ce sont
  des redirections, pas des pages.

---

## 7. Cartes de partage générées

[`app/episodes/[slug]/opengraph-image.tsx`](app/episodes/%5Bslug%5D/opengraph-image.tsx)
compose la carte comme la couverture du deck : noir, halo de braise, portrait
traité à droite, logotype avec son R retourné, numéro, invité, fonction,
entreprise, titre, adresse permanente, durée.

Trois contraintes de Satori conditionnent la composition — elles sont commentées
dans le fichier, et elles se paient cher si on les oublie :

1. **Les dégradés doivent passer par `backgroundImage`.** Dans le raccourci
   `background`, ils sont silencieusement ignorés — le calque est simplement
   absent, sans erreur.
2. **Un élément positionné en absolu doit porter des dimensions explicites.**
   `inset: 0` seul ne suffit pas : le calque n'est pas peint.
3. **`filter` n'existe pas.** Le traitement photographique de la charte est donc
   reconstitué en calques de dégradés posés sur l'`<img>`.

Les polices sont lues sur le disque au build, jamais sur le réseau : la
construction reste possible hors ligne. Satori n'instancie pas les axes d'une
police variable — les fichiers `assets/fonts/Sora-<poids>.ttf` sont des instances
statiques figées, extraites du fichier variable :

```bash
python3 -m pip install fonttools
python3 -m fontTools.varLib.instancer assets/fonts/<variable>.ttf wght=800 \
  -o assets/fonts/Sora-800.ttf
```

C'est ce qui permet d'obtenir le logotype en 800 sur les cartes. À refaire pour
PP Neue Machina si ses fichiers sont statiques par nature, l'étape disparaît.

---

## 8. Flux RSS

`/feed.xml` — RSS 2.0, namespaces `itunes`, `content`, `podcast`, `atom`.
Catégories Business/Entrepreneurship et Arts/Design, `itunes:episode`,
`itunes:duration`, `<enclosure>` avec type et taille réels, description longue et
liens de l'épisode dans `content:encoded`.

Le `<link>` de chaque item pointe sur la page du podcast, jamais sur une
plateforme : même dans une application d'écoute, l'adresse de référence reste la
nôtre.

Le site est la **source éditoriale** ; l'hébergement des fichiers, la mesure et
l'insertion dynamique restent le métier d'un hébergeur spécialisé (Acast, Ausha,
Podcastics…). Il suffit alors de faire pointer `audioUrl` et `audioBytes` vers son
CDN — le reste du flux ne change pas. Le site reste indépendant de la plateforme
de diffusion.

---

## 9. Motion

Un seul `IntersectionObserver` pour toute la page
([`components/Reveal.tsx`](components/Reveal.tsx)), qui bascule des attributs
`data-reveal*` ; le CSS fait le reste. Zéro bibliothèque d'animation, zéro
re-render React : les éléments animés restent des composants serveur.

- apparition en volet des titres (`data-reveal-mask`), en cascade des listes.
  Attention : ce masque impose `padding-block` / `margin-block` sur le titre, et
  l'emporte en spécificité sur toute marge posée ailleurs — elle disparaîtrait
  silencieusement. Les espacements d'un titre animé se déclarent donc via
  `--espace-avant` / `--espace-apres`, que la règle additionne ;
- le logotype révélé **lettre à lettre** en bas du hero, R retourné compris ;
- au survol d'une ligne d'archive, le **portrait de l'invité suit le curseur**
  (amorti, `requestAnimationFrame`, pointeur fin uniquement) ;
- ticker CSS, halos de braise, flèches qui glissent, boutons qui se remplissent
  par le bas ;
- approche lente de l'image du hero au chargement.

**Sans JavaScript**, la classe `.js` n'est jamais posée sur `<html>` et tout le
contenu s'affiche normalement — vérifié. **Sous `prefers-reduced-motion`**, tout
est révélé immédiatement, le ticker est figé, le point ON AIR ne pulse plus,
l'aperçu au curseur est désactivé — et le R retourné le reste.

---

## 10. Accessibilité, performance, responsive

Vérifié au navigateur sur 1440, 834 et 390 px :

- liens d'évitement (« Aller au contenu / au menu / au pied de page ») ;
- HTML sémantique, un seul `<h1>` par page, `lang="fr"`, `alt` sur 100 % des
  images (vide et `aria-hidden` pour les visuels décoratifs) ;
- le logotype est un `role="img"` avec `aria-label` : le lecteur d'écran entend
  « Derrière la marque », pas les trois fragments de lettres ;
- focus visible partout ; l'onde du lecteur est un vrai `<input type="range">`
  transparent, donc pilotable au clavier et annoncée avec `aria-valuetext` ;
- la bascule audio/vidéo est un groupe de boutons `aria-pressed`, pas un faux
  motif d'onglets ARIA sans panneaux ;
- contrastes AA vérifiés par le calcul (voir la palette) ;
- **aucun hôte tiers au chargement** : la vidéo YouTube est une façade cliquable
  (`youtube-nocookie`, iframe créée au clic) ;
- **CLS 0**, LCP local ~150–190 ms, 33 ko de CSS, 33 ko de police (fichier
  variable unique), images AVIF/WebP via `next/image`, `preload="metadata"` sur
  l'audio ;
- aucun débordement horizontal à aucune largeur testée.

---

## 11. Contenu de démonstration

Six épisodes, sujets cohérents avec le sujet du podcast : industrie et
décarbonation, design et fabrication, retail, distribution B2B et digital,
entrepreneuriat, marque et culture.

**Entreprises et invités sont fictifs.** Les ressources citées dans « Les liens de
l'épisode » pointent en revanche vers des **sources réelles** (ADEME, Insee,
Fevad, IFM, FEBEA, Bpifrance, Mobilier National, Cité du design, LSA, Stratégies,
Dezeen, L'Usine Digitale, Cosmetic Valley…), pour que le bloc se comporte comme
en production.

Photographies : Unsplash, rapatriées en local dans `public/episodes` — le
prototype n'appelle aucun CDN externe.

### Trois réserves à lever avant production

1. **L'audio est un placeholder.** `public/audio/dlm-demo.wav` est une nappe
   sonore de 40 s générée par script. Pour que le compteur et la barre de
   progression racontent la même chose que le reste de la page, le lecteur
   **étire** cette piste courte sur la durée annoncée (voir `echelle` dans
   [`components/EpisodeMedia.tsx`](components/EpisodeMedia.tsx)). Avec un vrai
   fichier, `echelle` vaut 1 et tout est exact — aucun code à retirer.
2. **`youtubeId` est le même identifiant partout**, et les URLs de plateforme sont
   des exemples. Ce sont exactement les six champs que l'on renseigne à la
   publication.
3. **La police de marque n'est pas embarquée** — voir §2.

Le formulaire de participation valide côté serveur puis journalise
([`app/api/participer/route.ts`](app/api/participer/route.ts)) : c'est là qu'on
branche l'API transactionnelle, le CRM ou la boîte partagée.

---

## 12. Dépendances

`next`, `react`, `react-dom`, `typescript` — et `qrcode`, seule dépendance
fonctionnelle ajoutée, pour une exigence explicite du cahier des charges. Pas de
Framer Motion : les animations demandées sont mieux servies par un observateur et
du CSS, sans coût sur le fil principal.
