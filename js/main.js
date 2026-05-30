// ── Nav scroll (IntersectionObserver — NO scroll listener)
const nav = document.getElementById('nav');
const sentinel = document.createElement('div');
sentinel.style.cssText = 'position:absolute;top:69px;height:1px;pointer-events:none;width:1px;';
document.body.prepend(sentinel);
new IntersectionObserver(([e]) => nav.classList.toggle('scrolled', !e.isIntersecting)).observe(sentinel);

// ── Mobile menu with animated transition + hamburger X
const ham = document.getElementById('ham');
const mob = document.getElementById('mobMenu');
ham.addEventListener('click', () => {
    const isOpen = mob.classList.toggle('open');
    ham.classList.toggle('is-open', isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
});
mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mob.classList.remove('open');
    ham.classList.remove('is-open');
    document.body.style.overflow = '';
}));

// ── Parallax hero background (rAF-based, smooth, no scroll listener on main thread)
const heroBg = document.getElementById('heroBg');
const heroImg = heroBg ? heroBg.querySelector('img') : null;
if (heroImg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const heroH = document.getElementById('hero').offsetHeight;
                const maxShift = Math.max(60, heroH * 0.15);
                const progress = Math.min(scrolled / heroH, 1);
                heroImg.style.transform = `translateY(${progress * maxShift}px)`;
                ticking = false;
            });
            ticking = true;
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
}

// ── Scroll reveal (IntersectionObserver — NO scroll listener)
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
document.querySelectorAll('.sr').forEach(el => io.observe(el));

// ── Form -> WhatsApp
document.getElementById('formBtn').addEventListener('click', () => {
    const nombre = document.getElementById('f-nombre').value.trim();
    const wa = document.getElementById('f-wa').value.trim();
    const need = document.getElementById('f-need').value;
    if (!nombre || !wa) { alert('Por favor completa tu nombre y WhatsApp para continuar.'); return; }
    const labels = { cabello: 'cuidado de cabello', piel: 'cuidado de piel', maquillaje: 'maquillaje', unas: 'cuidado de unas', tinte: 'tintes y color', pestanas: 'pestanas y cejas', profesional: 'productos profesionales', otro: 'informacion general' };
    const msg = encodeURIComponent(`Hola, soy ${nombre} (${wa}). Quiero una recomendacion sobre ${labels[need] || 'productos de belleza'}.`);
    window.open(`https://wa.me/529983904706?text=${msg}`, '_blank', 'noopener,noreferrer');
});

// ── Smooth anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
});