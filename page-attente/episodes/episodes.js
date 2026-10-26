// Miniature qui suit le pointeur au survol d'une ligne : souris seulement.
(() => {
  const lignes = document.querySelectorAll('[data-lignes] > li');
  const cadre = document.querySelector('[data-apercu-cadre]');
  const image = document.querySelector('[data-apercu-image]');
  if (!cadre || !image || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cible = { x: 0, y: 0 };
  const position = { x: 0, y: 0 };
  let boucle = null;

  const placer = () => {
    position.x += (cible.x - position.x) * (calme ? 1 : 0.18);
    position.y += (cible.y - position.y) * (calme ? 1 : 0.18);
    cadre.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
    const arrive = Math.abs(cible.x - position.x) < 0.3 && Math.abs(cible.y - position.y) < 0.3;
    boucle = arrive ? null : requestAnimationFrame(placer);
  };

  const suivre = (evenement) => {
    cible.x = evenement.clientX;
    cible.y = evenement.clientY;
    cadre.classList.toggle('apercu--gauche', evenement.clientX > window.innerWidth * 0.6);
    if (!boucle) boucle = requestAnimationFrame(placer);
  };

  for (const ligne of lignes) {
    const source = ligne.dataset.apercu;
    if (!source) continue;
    new Image().src = source;

    ligne.addEventListener('pointerenter', (evenement) => {
      if (!cadre.classList.contains('apercu--visible')) {
        position.x = evenement.clientX;
        position.y = evenement.clientY;
      }
      image.src = source;
      cadre.classList.add('apercu--visible');
      suivre(evenement);
    });
    ligne.addEventListener('pointermove', suivre);
    ligne.addEventListener('pointerleave', () => cadre.classList.remove('apercu--visible'));
  }
})();
