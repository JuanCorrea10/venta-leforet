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
   5 · GALERÍA LIGHTBOX
   ------------------------------------------------------------
   Click en una foto → se abre en pantalla completa.
   Flechas ← → o botones para navegar entre fotos.
   ESC para cerrar.
   ============================================================ */
const galleryFigures = Array.from(document.querySelectorAll('#galeria figure'));
const galleryLightbox = document.getElementById('gallery-lightbox');
const lightboxImg = galleryLightbox.querySelector('.gallery-lightbox-img');
const lightboxCaption = galleryLightbox.querySelector('.gallery-lightbox-caption');
const lightboxCounter = galleryLightbox.querySelector('.gallery-lightbox-counter');
const lightboxCloseBtn = galleryLightbox.querySelector('.gallery-lightbox-close');
const lightboxPrevBtn = galleryLightbox.querySelector('.gallery-lightbox-prev');
const lightboxNextBtn = galleryLightbox.querySelector('.gallery-lightbox-next');
const lightboxBackdrop = galleryLightbox.querySelector('.gallery-lightbox-backdrop');

let currentLightboxIndex = 0;

function openGalleryLightbox(index) {
  currentLightboxIndex = index;
  updateLightboxImage();
  galleryLightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lenis.stop();                   // pausar smooth scroll mientras el modal está abierto
}

function closeGalleryLightbox() {
  galleryLightbox.classList.remove('open');
  document.body.style.overflow = '';
  lenis.start();
}

function updateLightboxImage() {
  const fig = galleryFigures[currentLightboxIndex];
  const img = fig.querySelector('img');
  const caption = fig.querySelector('figcaption');

  // Pequeña animación de "swap": fade out → cambiar src → fade in
  lightboxImg.classList.add('swapping');
  setTimeout(() => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${galleryFigures.length}`;
    lightboxImg.classList.remove('swapping');
  }, 150);
}

function lightboxNext() {
  // operador % (módulo): si llega al final, vuelve al principio
  currentLightboxIndex = (currentLightboxIndex + 1) % galleryFigures.length;
  updateLightboxImage();
}

function lightboxPrev() {
  // sumamos el length antes de hacer % para evitar negativos
  currentLightboxIndex = (currentLightboxIndex - 1 + galleryFigures.length) % galleryFigures.length;
  updateLightboxImage();
}

// Click en cada figure abre el lightbox
galleryFigures.forEach((fig, index) => {
  fig.addEventListener('click', () => openGalleryLightbox(index));
});

// Botones
lightboxCloseBtn.addEventListener('click', closeGalleryLightbox);
lightboxPrevBtn.addEventListener('click', lightboxPrev);
lightboxNextBtn.addEventListener('click', lightboxNext);
lightboxBackdrop.addEventListener('click', closeGalleryLightbox);

// Teclado: ESC, ← y → solo cuando el lightbox está abierto
document.addEventListener('keydown', (e) => {
  if (!galleryLightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeGalleryLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev();
  if (e.key === 'ArrowRight') lightboxNext();
});
