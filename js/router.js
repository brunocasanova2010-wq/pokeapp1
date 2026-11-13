/* ============================================================================
   router.js  ->  NAVEGACIÓN ENTRE PANTALLAS CON JAVASCRIPT
   ============================================================================
   La consigna dice:
     "Las diferentes vistas deberán mostrarse dentro del elemento principal
      de la aplicación y la navegación deberá realizarse mediante JavaScript."

   ¿Cómo lo resolvemos?
     · Cada vista es una función que DEVUELVE texto HTML
       (la dibuja dibujarLanding(), dibujarPokedex(), etc.)
     · Este archivo guarda esas funciones en un registro (el objeto `vistas`)
     · irA(nombre) borra lo que hay dentro de <main id="app"> y pega
       el HTML de la vista pedida. Nunca recargamos la página.
   ============================================================================ */

/* Aquí guardamos: nombre de la vista -> función que la dibuja */
const vistas = {};

/* Atajos de teclado / botón atrás: se agregan desde main.js */
let alCambiarVista = null;

export function registrarVista(nombre, funcionDeLaVista) {
  vistas[nombre] = funcionDeLaVista;
}

export function configurarAlCambiarVista(funcion) {
  alCambiarVista = funcion;
}

/* Devuelve el nombre de la vista actual (por defecto "inicio") */
export function rutaActual() {
  const hash = window.location.hash.replace("#", "");
  return hash === "" ? "inicio" : hash;
}

/* ----------------------------------------------------------------------------
   irA(nombre, parametro)
   Es la función más importante: cambia de pantalla.

   · nombre     -> "inicio", "pokedex", "detalle", "login", ...
   · parametro  -> dato extra, por ejemplo el id del Pokémon en el detalle
   ---------------------------------------------------------------------------- */
export function irA(nombre, parametro = null) {
  const dibujar = vistas[nombre];

  if (typeof dibujar !== "function") {
    console.warn('La vista "' + nombre + '" no existe. Volvemos al inicio.');
    irA("inicio");
    return;
  }

  // 1) Buscamos el <main> donde vive toda la aplicación
  const app = document.getElementById("app");

  // 2) Borramos lo que había y ponemos el HTML de la vista nueva
  app.innerHTML = dibujar(parametro);

  // 3) Llevamos el scroll arriba para que se sienta como un cambio de pantalla
  window.scrollTo({ top: 0, behavior: "smooth" });

  // 4) Avisamos que cambiamos de vista (lo usa main.js para el menú y el header)
  if (typeof alCambiarVista === "function") {
    alCambiarVista(nombre, parametro);
  }
}

/* Permite saber desde main.js si alguien ya sabe dibujar una vista */
export function existeVista(nombre) {
  return typeof vistas[nombre] === "function";
}
