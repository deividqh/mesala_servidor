// Algunos navegadores, especialmente Safari en iOS, pueden ignorar la
// restricción de zoom indicada en la etiqueta viewport.
function bloquearZoom(evento) {
    if (evento.cancelable) {
        evento.preventDefault();
    }
}

document.addEventListener('touchmove', (evento) => {
    if (evento.touches.length > 1) {
        bloquearZoom(evento);
    }
}, { passive: false });

document.addEventListener('gesturestart', bloquearZoom, { passive: false });
document.addEventListener('gesturechange', bloquearZoom, { passive: false });