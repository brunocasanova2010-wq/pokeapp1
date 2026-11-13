/* ============================================================================
   utilidades.js  ->  AYUDANTES QUE SE USAN EN TODAS LAS VISTAS
   ============================================================================
   Chiquitos, pero evitan repetir el mismo código en todos lados:
     · mostrarToast()      -> cartelito rápido abajo de la pantalla
     · escaparHTML()       -> evita que un nombre con < > rompa la página
     · formatearNumero()   -> número con 3 cifras (001, 025...)
     · sonar()             -> reproduce un audio
     · capitalizar()       -> primera letra en mayúscula
     · nombreTipoClase()   -> "Eléctrico" sirve como clase CSS
   ============================================================================ */

/* ----------------------------------------------------------------------------
   TOAST: cartelito de aviso
   ---------------------------------------------------------------------------- */
let temporizadorToast = null;

export function mostrarToast(mensaje, tipo = "ok") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = mensaje;
  toast.className = "toast visible" + (tipo === "error" ? " error" : "");

  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(() => {
    toast.className = "toast" + (tipo === "error" ? " error" : "");
  }, 2600);
}

/* ----------------------------------------------------------------------------
   ESCAPAR HTML
   Si alguien carga un Pokémon llamado <script>, no queremos que se ejecute.
   ---------------------------------------------------------------------------- */
export function escaparHTML(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* ----------------------------------------------------------------------------
   NÚMERO DE POKÉDEX: 1 -> "#001"
   ---------------------------------------------------------------------------- */
export function formatearNumero(numero) {
  return "#" + String(numero).padStart(3, "0");
}

/* ----------------------------------------------------------------------------
   SONIDO
   Recibe una ruta (ej: "./assets/sound/pikachu.mp3") y lo reproduce.
   ---------------------------------------------------------------------------- */
export function sonar(ruta) {
  if (!ruta) return;

  const audio = new Audio(ruta);
  audio.volume = 0.55;

  // .play() devuelve una promesa que puede fallar si el navegador bloquea el audio
  audio.play().catch(() => {
    // silencio: no pasa nada si el navegador no deja sonar
  });
}

/* ----------------------------------------------------------------------------
   CAPITALIZAR: "pikachu" -> "Pikachu"
   ---------------------------------------------------------------------------- */
export function capitalizar(texto) {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/* ----------------------------------------------------------------------------
   NOMBRE DE CLASE PARA LOS TIPOS
   "Eléctrico" -> "Eléctrico" (el CSS ya tiene las clases con acentos)
   Lo dejamos en una función para poder cambiarlo en un solo lugar.
   ---------------------------------------------------------------------------- */
export function nombreTipoClase(tipo) {
  return tipo;
}

/* ----------------------------------------------------------------------------
   FECHA PARA COMENTARIOS DE CONSOLA / RENDIMIENTO
   ---------------------------------------------------------------------------- */
export function copiarTexto(texto) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(texto).catch(() => {});
  }
}
