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

Relevée sur la page **DLM** du fichier de charte (Figma, nœuds `2894:270` →
`2894:438`) — échantillonnée au pixel, pas approchée à l'œil. C'est une leçon
payée : une révision précédente avait pris la couleur d'un *calque* Figma avant
fusion, et le site en était ressorti visiblement plus pâle que la planche.

**La révision principale est un renversement de registre.** La version
précédente était bleu nuit de bout en bout. Le fichier révisé pose sa
typographie **bleu nuit sur des fonds clairs** — c'est le cas de la planche de
mise en situation, des pochettes et de la couverture. Le registre clair est donc
devenu le registre par défaut, le bleu nuit un registre plein tenu pour les
bandes de respiration et le pied de page, le champ orange la ponctuation.

### Typographie — deux familles

La charte en déclare deux, toutes deux Pangram Pangram et sous licence
commerciale, donc **non embarquées** :

| Rôle | Police de la charte | Substitut libre embarqué |
|---|---|---|
| Logotype et titres | **PP Neue Machina** | **Sora** — même ADN géométrique à courbes carrées, jusqu'à 800 |
| Noms et texte courant | **PP Neue Montreal** | **Instrument Sans** — néo-grotesque de même largeur étroite |

Les substituts ont été choisis en rendant les candidats côte à côte contre la
planche typographique du fichier, pas au jugé. Les noms sous licence sont
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

Cinq valeurs dans le fichier, relevées au pixel sur la planche de nuancier :

| Relevé | Valeur |
|---|---|
| Encre | `#0E0F13` |
| Bleu ardoise | `#1D2C3E` |
| Brume | `#B1BFCF` |
| Terre cuite | `#BD5E27` |
| Crème | `#ECE9E4` |

Le fond des planches est en outre à `#1A243D` — c'est cette valeur, et non celle
du nuancier, qui sert de surface bleu nuit.

Les jetons du système ajoutent ce que le contraste exige et que le nuancier ne
fournit pas :

| Token | Valeur | Usage | Contraste |
|---|---|---|---|
| `--creme` | `#ece9e4` | **fond dominant** | — |
| `--creme-creuse` | `#e2ddd5` | alternance de section | — |
| `--nuit` | `#1a243d` | registre plein, texte sur crème | 12,7:1 sur crème |
| `--nuit-profond` | `#141b2e` | alternance dans le registre nuit | — |
| `--nuit-haute` | `#232e4c` | encarts, lecteur, champs | — |
| `--plomb` | `#565e6c` | texte secondaire sur crème | 5,4:1 |
| `--brume` | `#b1bfcf` | texte courant sur bleu nuit | 8,2:1 |
| `--brume-sourde` | `#8490a4` | tertiaire sur bleu nuit | 4,8:1 |
| `--encre` | `#0e0f13` | typographie sur photographie | 15,8:1 sur crème |
| `--orange` | `#bd5e27` | aplats, points, filets — **graphique** | 3,6:1 / 3,5:1 |
| `--orange-fonce` | `#a94e21` | texte accentué sur crème | 4,6:1 |
| `--orange-texte` | `#d17946` | texte accentué sur bleu nuit | 4,8:1 |
| `--orange-clair` | `#e08a55` | petites capitales sur bleu nuit | 5,8:1 |
| `--brasier-panneau` | `#97461c` | panneau de texte sur le champ orange | 6,5:1 en blanc |

**Trois valeurs d'orange, imposées par le contraste.** `#BD5E27` est la couleur
de marque mais ne porte pas de texte : 3,6:1 sur crème, 3,5:1 sur bleu nuit —
assez pour un point ou un filet (seuil 3:1), pas pour un mot. `#A94E21` atteint
4,6:1 et porte les mots du registre clair, `#D17946` fait le même travail sur
bleu nuit.

**Le panneau orange assombri est la solution du fichier, pas la mienne.** Là où
la charte pose un bloc de texte long sur l'orange — le flanc droit des cartes
d'épisode — elle assombrit son propre aplat. Relevé à `#97461C`, ce qui fait
passer le blanc de 4,4:1 à 6,5:1. Le dégradé n'est donc pas décoratif : il est ce
qui rend le bloc lisible.

Deux valeurs (`--plomb`, `--orange-fonce`) ne figurent pas dans le fichier : ce
sont les valeurs du nuancier désaturées ou densifiées jusqu'au seuil AA. Un
nuancier de marque n'est pas un système de texte.

### Les trois registres

Un seul mécanisme : chaque classe réécrit les jetons de contexte, et tout ce qui
vit à l'intérieur suit — filets, boutons, contour de focus, voile des
photographies, bouton plein. **Aucun composant ne code sa propre couleur.**

| Classe | Fond | Texte | Bouton plein |
|---|---|---|---|
| *(défaut)* | crème | bleu nuit | bleu nuit |
| `.nuit` | bleu nuit | crème / brume | terre cuite |
| `.brasier` | champ orange | encre | bleu nuit |
| `.panneau` | orange assombri | blanc | — |

Le bouton plein déclare deux paires, repos et survol, au lieu de dériver la
seconde de la première : sur l'orange de marque, **aucune couleur n'atteint AA**
— l'encre plafonne à 4,37:1 et le blanc à 4,38:1, les deux meilleurs candidats.
Le bouton plein du registre nuit prend donc l'orange assombri, où le blanc monte
à 6,5:1. Les six états (trois registres × repos/survol) sont mesurés sur le rendu
et tiennent entre 5,4:1 et 12,7:1.

`.surface` creuse la surface d'un cran **sans changer de registre** : crème
appuyé en clair, bleu nuit profond en nuit. `.braise` pose le halo de la charte
(variantes `.braise--basse`, `.braise--gauche`), avec deux dosages — sur crème,
un halo orange se voit dix fois plus que sur bleu nuit, et les valeurs du
registre nuit y faisaient une tache.

Le rythme de la home : hero clair → manifeste bleu nuit → bandeau défilant →
dernier épisode sur crème → liens → archive en crème appuyé → pied bleu nuit.

### La carte d'épisode

Le geste central du fichier révisé, porté par
[`components/EpisodeCard.tsx`](components/EpisodeCard.tsx) : un cadre arrondi
coupé en deux, la photographie à gauche sous le logotype, le panneau de texte à
droite sur l'orange assombri.

Elle est le **seul arrondi** du système (`--rayon-carte: 22px`) et le seul aplat
de couleur pleine. Son logotype se mesure à la carte et non à la fenêtre
(`container-type: inline-size`, unités `cqw`) : la même carte dans une colonne de
560 px et en pleine largeur porte le même logotype à l'échelle.

### Les libellés

Le fichier fixe trois tournures, portées par
[`lib/episodes.ts`](lib/episodes.ts) :

- `episodeName()` → **« Derrière Café Reck, il y a Thomas Riegert »**. Relevée
  telle quelle sur la planche Apple Podcasts, où le gabarit est écrit en clair :
  *« DERRIÈRE LA MARQUE XX, il y a XXXX »*. Le nom du média est un début de
  phrase que chaque épisode termine — c'est le ressort éditorial du podcast. Elle
  sert de titre partout où le contexte ne dit pas déjà de quel média il s'agit :
  flux RSS, carte de partage, référencement, données structurées.
- `episodeIdentity()` → **« Derrière la marque Reck »**. Le verrou graphique : le
  nom du client devient la **troisième ligne du logotype**. Le média ne se
  juxtapose pas au client, il l'absorbe.
- `guestCredit()` → **« Avec Thomas Riegert, artisan torréfacteur »** — le crédit
  des cartes. La fonction est décapitalisée dans la phrase, sauf sigles et noms
  propres.

« Il y a » et « Avec » coexistent dans le fichier et ne disent pas la même
chose : *il y a* est la voix du titre, qui révèle quelqu'un derrière une marque ;
*Avec* est le crédit, qui l'attribue.

Le site garde en plus le titre rédactionnel (`episode.title`) pour son grand
titre — c'est ce que la charte affiche sur la carte, sous le nom de l'épisode. Le
JSON-LD expose les deux : `name` porte la formule, `alternateName` le titre
rédactionnel.

Le descripteur du logotype est **« Le podcast »**, la catégorie de diffusion
**« Business »** — les deux relevés sur les planches.

### Le logotype

**DERᴙIÈRE LA MARQUE** — le geste de la marque est le **troisième R, retourné**.
Dessiné en typographie, jamais en image : il reste net à toute taille et hérite
de la couleur de son contexte.

- [`components/Wordmark.tsx`](components/Wordmark.tsx) — barre de navigation et
  lockup ; la prop `marque` ajoute la troisième ligne (le client)
- [`components/SplitLogo.tsx`](components/SplitLogo.tsx) — version à l'échelle du
  cadre, révélée lettre à lettre ; le miroir est composé **avec** la translation
  du volet, pas écrasé par elle
- [`components/MicroIcon.tsx`](components/MicroIcon.tsx) — l'icône micro,
  tracés repris tels quels du nœud Figma `2874:173`, peinte en `currentColor`

### Photographie

La charte photographie **en lumière du jour** — mur clair, cuir fauve, aucun
assombrissement. Le traitement se limite donc à un appui de contraste : la
densité réduite de la version bleu nuit salissait l'image sur un fond crème.

```
image → voile (lisibilité du texte) → lumière orange (par-dessus le voile)
```

L'ordre compte : dans l'autre sens, le voile éteignait la couleur. Le voile est
en deux dégradés — le latéral garantit une colonne calme à gauche, là où vit la
typographie, ce qui rend la lisibilité indépendante de la photo fournie.

Sa teinte vient du registre (`--voile`), pas du fichier : crème sur fond clair,
bleu nuit sur fond nuit. Le mode de fusion de la lumière orange suit aussi le
registre — `multiply` en clair, `screen` en nuit — et à deux fois moins
d'opacité : un `multiply` orange sur une photographie en lumière du jour teinte
tout le cadre en pêche.

Le voile sous la barre de navigation suit la même règle. Il était noir ; sous une
typographie bleu nuit, un voile noir rendait l'en-tête **moins** lisible.

### Interdits tenus

Aucun `border-radius` hors la carte d'épisode et les pastilles circulaires par
nature, aucun dégradé décoratif hors les halos et le champ de la charte, aucune
ombre, aucun logotype de plateforme, aucune icône hors le micro de marque et les
flèches typographiques.

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

Deux cartes, une par registre :

- [`app/opengraph-image.tsx`](app/opengraph-image.tsx) — la pochette claire :
  fond crème, lavis terre cuite, logotype bleu nuit, « Avec Frédéric
  Cronenberger ». Sert la home, l'archive, À propos et Participer.
- [`app/episodes/[slug]/opengraph-image.tsx`](app/episodes/%5Bslug%5D/opengraph-image.tsx)
  — la **carte d'épisode du fichier de charte**, portée à l'identique : champ
  orange, carte arrondie, photographie à gauche sous le logotype augmenté du nom
  du client, panneau de texte à droite sur l'orange assombri, numéro, crédit,
  durée, adresse permanente.

Quatre contraintes de Satori conditionnent la composition — elles sont commentées
dans les fichiers, et elles se paient cher si on les oublie :

1. **Les dégradés doivent passer par `backgroundImage`.** Dans le raccourci
   `background`, ils sont silencieusement ignorés — le calque est simplement
   absent, sans erreur.
2. **Un élément positionné en absolu doit porter des dimensions explicites.**
   `inset: 0` seul ne suffit pas : le calque n'est pas peint.
3. **`filter` n'existe pas**, et un calque *frère* posé sur une `<img>` ne se
   peint pas au-dessus d'elle. Le traitement photographique de la charte est donc
   reconstitué en calques de dégradés **imbriqués**.
4. **Un nœud de texte à plusieurs enfants lève une exception.** Chaque ligne est
   une chaîne assemblée en amont — sauf le R retourné, qui a besoin de ses propres
   balises.

Une cinquième leçon, mesurée : **Satori quantifie ses dégradés par paliers.** Sur
un fond clair, un dégradé radial y laisse voir des anneaux concentriques quel que
soit le nombre d'arrêts. Le lavis de la pochette claire est donc *linéaire* — les
mêmes paliers répartis sur une diagonale, où l'œil ne les organise plus en
cibles.

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

**Entreprises et invités sont fictifs.** Le fichier de charte cite un premier
épisode réel — Café Reck, avec Thomas Riegert, artisan torréfacteur, 45 min. Il
n'est **pas** dans les données de démonstration : la convention de nommage est en
place, mais écrire une description, une biographie ou un extrait pour une
personne et une entreprise réelles demande leur contenu, pas le mien. L'ajouter
ne coûte qu'une entrée dans [`content/episodes.ts`](content/episodes.ts).
 Les ressources citées dans « Les liens de
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
3. **Les deux polices de marque ne sont pas embarquées** — PP Neue Machina *et*
   PP Neue Montreal sont sous licence commerciale. Il faut leurs `.woff2`, plus
   des instances statiques de la Machina pour les cartes de partage. Voir §2 et
   §7.

Le formulaire de participation valide côté serveur puis journalise
([`app/api/participer/route.ts`](app/api/participer/route.ts)) : c'est là qu'on
branche l'API transactionnelle, le CRM ou la boîte partagée.

---

## 12. Dépendances

`next`, `react`, `react-dom`, `typescript` — et `qrcode`, seule dépendance
fonctionnelle ajoutée, pour une exigence explicite du cahier des charges. Pas de
Framer Motion : les animations demandées sont mieux servies par un observateur et
du CSS, sans coût sur le fil principal.
