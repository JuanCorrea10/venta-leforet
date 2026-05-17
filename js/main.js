/*
  main.js — Scripts del sitio Apto 1605
  ============================================
  Por ahora solo inicializa Lenis para que el scroll se sienta
  "buttery" — el efecto que tienen los sitios de lujo (212 W 72nd,
  edificios single-property de Manhattan, etc).
*/


/* ============================================
   LENIS: smooth scroll con momentum
   --------------------------------------------
   Lenis intercepta el scroll del wheel/trackpad y lo aplica con
   easing suave en vez de bruscamente. Le da sensación cinemática.

   Settings explicados:
   - duration: cuánto tarda en "alcanzar" la posición destino (en seg)
   - easing: curva del movimiento. Esta es la "expo out" clásica
   - smoothWheel: SÍ aplicamos smooth al wheel del mouse
   - smoothTouch: NO en móvil (el scroll nativo del celu es mejor)
   ============================================ */
const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,
});

/*
  requestAnimationFrame: le pedimos al navegador que ejecute
  nuestra función "raf" antes de cada frame de animación
  (~60 veces por segundo). Lenis lo necesita para hacer su trabajo.
*/
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
