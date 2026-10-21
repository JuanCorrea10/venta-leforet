/*
  ============================================================
  main.js — Scripts del sitio Apto 1605 Leforet El Vergel
  ============================================================
  Este archivo contiene TODO el JavaScript del sitio.
  Está dividido en bloques claros, uno por cada feature.

  El JavaScript moderno es legible y poderoso. Acá usamos:
  - Lenis (librería) para smooth scroll
  - IntersectionObserver para detectar elementos visibles
  - requestAnimationFrame para animaciones suaves
  - querySelector y addEventListener para interactividad
*/


/* ============================================================
   1 · LENIS — smooth scroll con momentum
   ------------------------------------------------------------
   Lenis intercepta el scroll del wheel/trackpad y lo aplica con
   easing suave. Le da sensación cinemática a la página.
   ============================================================ */
const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,           // en celular dejamos el scroll nativo
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


/* ============================================================
   2 · BARRA DE PROGRESO DE SCROLL
   ------------------------------------------------------------
   La línea fina arriba de la página que se va llenando a medida
   que bajamos. Calcula el % de scroll y lo guarda en una CSS
   variable que el estilo lee.
   ============================================================ */
const scrollProgress = document.querySelector('.scroll-progress');

function updateScrollProgress() {
  // scrollY: cuántos pixels hacia abajo estamos
  // scrollHeight: alto total de la página
  // innerHeight: alto del viewport visible
  const scrollTop = window.scrollY;
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / totalHeight) * 100;

  // Actualizamos la CSS custom property que usa el ::after
  scrollProgress.style.setProperty('--progress', progress + '%');
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();


/* ============================================================
   3 · COUNT-UP DE LOS STATS DEL HERO
   ------------------------------------------------------------
   Los números del hero (167, 3, 16) cuentan desde 0 hasta su valor
   cuando se cargan. Usamos requestAnimationFrame para animar suave.

   ¿Por qué requestAnimationFrame y no setInterval?
   - rAF está sincronizado con la pantalla (60fps real)
   - Si la pestaña está en background, pausa solo (ahorra batería)
   - Es la forma "pro" de animar en JS
   ============================================================ */
const heroStats = document.querySelectorAll('.hero-stats strong');

function animateCount(el) {
  const target = parseInt(el.textContent, 10);
  if (isNaN(target)) return;

  const duration = 1600;          // 1.6 segundos
  const startTime = performance.now();
  // performance.now() devuelve timestamp en milisegundos, muy preciso

  function frame(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Curva "ease-out cubic" — empieza rápido y desacelera
    const eased = 1 - Math.pow(1 - progress, 3);

    el.textContent = Math.round(target * eased);

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

// Disparamos la animación con un pequeño delay para que sea después
// de las animaciones de entrada del hero
window.addEventListener('load', () => {
  setTimeout(() => {
    heroStats.forEach(animateCount);
  }, 900);
});


/* ============================================================
   4 · ESCONDER WHATSAPP FLOTANTE CERCA DE CONTACTO
   ------------------------------------------------------------
   Si el usuario está viendo la sección de contacto, no necesita
   el botón flotante (ya tiene los botones grandes ahí).
   Usamos IntersectionObserver — la API moderna para detectar
   "este elemento entró/salió del viewport".
   ============================================================ */
const whatsappBtn = document.querySelector('.whatsapp-flotante');
const contactoSection = document.getElementById('contacto');

if (whatsappBtn && contactoSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        whatsappBtn.classList.add('is-hidden');
      } else {
        whatsappBtn.classList.remove('is-hidden');
      }
    });
  }, {
    threshold: 0.25,              // se activa cuando contacto ocupa 25% del viewport
  });

  observer.observe(contactoSection);
}


/* ============================================================
   5 · PLANO LIGHTBOX
   ------------------------------------------------------------
   Antes el plano se abría/cerraba con CSS :target (URL anchor),
   pero al cerrar el navegador hacía scroll al inicio. Ahora lo
   controlamos con JS — la URL nunca cambia, el scroll se preserva.
   ============================================================ */
const planoTrigger = document.querySelector('.plano-trigger');
const planoLightbox = document.getElementById('plano-zoom');

if (planoTrigger && planoLightbox) {
  const planoBackdrop = planoLightbox.querySelector('.lightbox-backdrop');
  const planoClose = planoLightbox.querySelector('.lightbox-close');

  function openPlano(e) {
    if (e) e.preventDefault();      // evita que el navegador navegue al anchor
    planoLightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lenis.stop();
  }

  function closePlano(e) {
    if (e) e.preventDefault();
    planoLightbox.classList.remove('open');
    document.body.style.overflow = '';
    lenis.start();
  }

  planoTrigger.addEventListener('click', openPlano);
  planoBackdrop.addEventListener('click', closePlano);
  planoClose.addEventListener('click', closePlano);

  // ESC cierra
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && planoLightbox.classList.contains('open')) {
      closePlano();
    }
  });
}


/* ============================================================
   6 · GALERÍA — CARRUSEL A PANTALLA COMPLETA
   ------------------------------------------------------------
   Click en una foto → se abre un carrusel con todas las fotos.
   - Celu: deslizar con el dedo (swipe).
   - Compu: flechas en pantalla o ← → del teclado.
   - Miniaturas abajo para saltar directo a una foto.
   ESC, la X o click en el fondo para cerrar.

   El swipe NO lo programamos: lo hace el CSS (scroll-snap, ver
   sección 19 de styles.css). Acá solo armamos las slides, movemos
   el scroll con los botones y averiguamos qué foto se está viendo.
   ============================================================ */
const galleryFigures = Array.from(document.querySelectorAll('#galeria figure'));
const galleryLightbox = document.getElementById('gallery-lightbox');
const carouselTrack = galleryLightbox.querySelector('.gallery-carousel');
const thumbsStrip = galleryLightbox.querySelector('.gallery-thumbs');
const lightboxCaption = galleryLightbox.querySelector('.gallery-lightbox-caption');
const lightboxCounter = galleryLightbox.querySelector('.gallery-lightbox-counter');
const lightboxCloseBtn = galleryLightbox.querySelector('.gallery-lightbox-close');
const lightboxPrevBtn = galleryLightbox.querySelector('.gallery-lightbox-prev');
const lightboxNextBtn = galleryLightbox.querySelector('.gallery-lightbox-next');
const lightboxBackdrop = galleryLightbox.querySelector('.gallery-lightbox-backdrop');

// Si la persona pidió "menos movimiento" en su sistema, saltamos sin animar
const scrollAnimation = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

let currentLightboxIndex = 0;

// Armamos una slide y una miniatura por cada foto de la galería.
// Así, si mañana se agrega o cambia una foto en el HTML, el carrusel
// se actualiza solo — no hay que tocar nada acá.
const thumbButtons = galleryFigures.map((fig, index) => {
  const img = fig.querySelector('img');
  const caption = fig.querySelector('figcaption');

  const slide = document.createElement('div');
  slide.className = 'gallery-slide';
  const slideImg = img.cloneNode();     // copia del <img> (mismo src y alt)
  slideImg.draggable = false;           // que en compu no se "arrastre" la foto
  slide.append(slideImg);
  carouselTrack.append(slide);

  const thumb = document.createElement('button');
  thumb.className = 'gallery-thumb';
  thumb.setAttribute('aria-label', `Ver foto ${index + 1}${caption ? ': ' + caption.textContent : ''}`);
  thumb.append(img.cloneNode());
  thumb.addEventListener('click', () => goToSlide(index));
  thumbsStrip.append(thumb);
  return thumb;
});

// Mueve el scroll de la pista hasta la slide pedida.
// Cada slide mide lo mismo que la pista, entonces la slide N
// empieza en N × ancho.
function goToSlide(index, behavior = scrollAnimation) {
  carouselTrack.scrollTo({ left: index * carouselTrack.clientWidth, behavior });
}

// Actualiza contador, texto y miniatura activa
function updateLightboxMeta(index) {
  currentLightboxIndex = index;
  const caption = galleryFigures[index].querySelector('figcaption');
  lightboxCaption.textContent = caption ? caption.textContent : '';
  lightboxCounter.textContent = `${index + 1} / ${galleryFigures.length}`;

  thumbButtons.forEach((thumb, i) => {
    thumb.classList.toggle('is-active', i === index);
    thumb.toggleAttribute('aria-current', i === index);
  });

  // Centrar la miniatura activa en su fila (por si no entran todas)
  const active = thumbButtons[index];
  thumbsStrip.scrollTo({
    left: active.offsetLeft - (thumbsStrip.clientWidth - active.offsetWidth) / 2,
    behavior: scrollAnimation,
  });
}

// ¿Qué foto se está viendo? La calculamos con la posición del scroll:
// funciona igual si llegaste con swipe, flecha, teclado o miniatura.
// Math.round = la foto cambia cuando pasaste la mitad del camino.
carouselTrack.addEventListener('scroll', () => {
  const index = Math.round(carouselTrack.scrollLeft / carouselTrack.clientWidth);
  if (index !== currentLightboxIndex && galleryFigures[index]) {
    updateLightboxMeta(index);
  }
});

function openGalleryLightbox(index) {
  galleryLightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lenis.stop();                   // pausar smooth scroll mientras el modal está abierto
  goToSlide(index, 'auto');       // 'auto' = aparecer directo en la foto tocada, sin "viajar"
  updateLightboxMeta(index);
}

function closeGalleryLightbox() {
  galleryLightbox.classList.remove('open');
  document.body.style.overflow = '';
  lenis.start();
}

function lightboxNext() {
  // operador % (módulo): si llega al final, vuelve al principio
  goToSlide((currentLightboxIndex + 1) % galleryFigures.length);
}

function lightboxPrev() {
  // sumamos el length antes de hacer % para evitar negativos
  goToSlide((currentLightboxIndex - 1 + galleryFigures.length) % galleryFigures.length);
}

// Click en cada figure abre el carrusel en esa foto
galleryFigures.forEach((fig, index) => {
  fig.addEventListener('click', () => openGalleryLightbox(index));
});

// Botones
lightboxCloseBtn.addEventListener('click', closeGalleryLightbox);
lightboxPrevBtn.addEventListener('click', lightboxPrev);
lightboxNextBtn.addEventListener('click', lightboxNext);
lightboxBackdrop.addEventListener('click', closeGalleryLightbox);

// Click en el espacio vacío al costado de la foto también cierra
// (la slide ocupa todo el ancho, así que tapa el backdrop)
carouselTrack.addEventListener('click', (e) => {
  if (e.target.classList.contains('gallery-slide')) closeGalleryLightbox();
});

// Si se gira el celu o cambia el tamaño de la ventana, cambia el ancho
// de las slides: re-ubicamos el scroll en la foto que se estaba viendo
window.addEventListener('resize', () => {
  if (galleryLightbox.classList.contains('open')) goToSlide(currentLightboxIndex, 'auto');
});

// Teclado: ESC, ← y → solo cuando el carrusel está abierto
document.addEventListener('keydown', (e) => {
  if (!galleryLightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeGalleryLightbox();
  if (e.key === 'ArrowLeft') { e.preventDefault(); lightboxPrev(); }
  if (e.key === 'ArrowRight') { e.preventDefault(); lightboxNext(); }
});
