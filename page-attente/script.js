(() => {
  const ATTRIBUTS = ['data-reveal', 'data-reveal-mask', 'data-reveal-letters'];
  const elements = document.querySelectorAll('[data-reveal], [data-reveal-mask], [data-reveal-letters]');

  document.querySelectorAll('.lettre').forEach((lettre, i) => {
    lettre.style.transitionDelay = `${i * 34}ms`;
  });

  const montrer = (element) => {
    for (const attribut of ATTRIBUTS) {
      if (element.getAttribute(attribut) === 'pending') element.setAttribute(attribut, 'in');
    }
  };

  const demarrer = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(montrer);
      return;
    }

    const observateur = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          if (!entree.isIntersecting) continue;
          montrer(entree.target);
          observateur.unobserve(entree.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) montrer(element);
      else observateur.observe(element);
    });
  };

  const polices = document.fonts ? document.fonts.ready : Promise.resolve();
  const plafond = new Promise((resoudre) => setTimeout(resoudre, 1000));
  Promise.race([polices, plafond]).then(() => {
    requestAnimationFrame(() => requestAnimationFrame(demarrer));
  });
})();

document.querySelectorAll('[data-courriel]').forEach((lien) => {
  const adresse = `${lien.dataset.courriel}@${lien.dataset.domaine}`;
  const sujet = lien.dataset.sujet;
  lien.href = `mailto:${adresse}${sujet ? `?subject=${encodeURIComponent(sujet)}` : ''}`;
  if (lien.hasAttribute('data-afficher')) lien.textContent = adresse;
});
