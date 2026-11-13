/* ============================================================================
   guionBatalla.js  ->  EL GUION DE LA BATALLA
   ============================================================================
   La batalla es una SECUENCIA de situaciones.
   Cada situación tiene un nombre (clave) y adentro:
     · titulo   -> etiqueta chiquita arriba del texto
     · texto    -> lo que aparece en la caja de diálogo
     · efectos  -> cambios de vida al ENTRAR a esa situación (opcional)
     · acciones -> botones con su destino
     · final    -> "ganaste" o "perdiste" si termina ahí
   ============================================================================ */

/* Personajes de la batalla */
export const TU_POKEMON = "Pikachu";
export const POKEMON_RIVAL = "Gengar";

/* Vida máxima de cada uno */
export const VIDA_MAXIMA_JUGADOR = 120;
export const VIDA_MAXIMA_RIVAL = 100;

/* Situación con la que arranca la batalla */
export const TURNO_INICIAL = "turno1";

/* ============================================================================
   EL GUION COMPLETO
   ============================================================================ */
export const guion = {

  /* ---------------------------- TURNO 1 ---------------------------- */
  turno1: {
    titulo: "TURNO 1",
    texto:
      "Un Gengar salvaje bloquea el camino.\n" +
      "Pikachu chisporrotea las mejillas, listo para pelear.\n\n" +
      "¿Qué querés hacer?",
    acciones: [
      { texto: "⚡ ATACAR", destino: "golpeRival1" },
      { texto: "🧪 USAR POCIÓN", destino: "pocion1" },
      { texto: "🏃 INTENTAR HUIR", destino: "huida" }
    ]
  },

  /* ------------------------ POCIÓN EN TURNO 1 ----------------------- */
  pocion1: {
    titulo: "TURNO 1 · POCIÓN",
    texto:
      "Usás una poción sobre Pikachu y recupera energías.\n" +
      "Pero Gengar aprovecha el descuido y lanza Bola Sombra.\n" +
      "Te queda una sola poción en la mochila.",
    efectos: { vidaJugador: 15, vidaRival: -5 },
    acciones: [{ texto: "Continuar", destino: "turno2" }]
  },

  /* ------------------- GOLPE DEL JUGADOR (turno 1) ------------------ */
  golpeRival1: {
    titulo: "TURNO 1 · ATAQUE",
    texto:
      "¡Pikachu usa Impactrueno!\n" +
      "El Gengar retrocede entre las sombras, pero no se rinde.",
    efectos: { vidaRival: -35 },
    acciones: [{ texto: "Continuar", destino: "turno2" }]
  },

  /* ---------------------------- TURNO 2 ---------------------------- */
  turno2: {
    titulo: "TURNO 2",
    texto:
      "¡Gengar contraataca con Bola Sombra!\n" +
      "El golpe te debilita bastante.\n\n" +
      "¿Qué hacés ahora?",
    efectos: { vidaJugador: -35 },
    acciones: [
      { texto: "⚡ ATACAR", destino: "golpeTurno2" },
      { texto: "🧪 USAR POCIÓN", destino: "pocion2" },
      { texto: "🛡️ DEFENDERSE", destino: "defensa" }
    ]
  },

  /* ------------------------ POCIÓN EN TURNO 2 ----------------------- */
  pocion2: {
    titulo: "TURNO 2 · POCIÓN",
    texto:
      "Usás la última poción. Pikachu se recupera un poco.\n" +
      "Gengar se ríe: «no te va a alcanzar...».\n" +
      "Ya no te quedan pociones.",
    efectos: { vidaJugador: 30 },
    acciones: [{ texto: "Continuar", destino: "turno3" }]
  },

  /* ------------------- GOLPE DEL JUGADOR (turno 2) ------------------ */
  golpeTurno2: {
    titulo: "TURNO 2 · ATAQUE",
    texto:
      "¡Impactrueno otra vez!\n" +
      "El Gengar empieza a tambalear... está a punto de caer.",
    efectos: { vidaRival: -40 },
    acciones: [{ texto: "Continuar", destino: "turno3" }]
  },

  /* --------------------------- DEFENDERSE -------------------------- */
  defensa: {
    titulo: "TURNO 2 · DEFENSA",
    texto:
      "Pikachu se cubre y aguanta el golpe casi sin daño.\n" +
      "Pero no atacaste: el Gengar recupera confianza.",
    efectos: { vidaJugador: -5 },
    acciones: [{ texto: "Continuar", destino: "turno3" }]
  },

  /* ---------------------------- TURNO 3 ---------------------------- */
  turno3: {
    titulo: "TURNO 3",
    texto:
      "Gengar está cansado pero sigue en pie.\n" +
      "Es el momento decisivo: ¿arriesgás todo con un ataque eléctrico\n" +
      "o jugás seguro esperando el momento justo?",
    acciones: [
      { texto: "⚡ IMPACTRUENO (arriesgado)", destino: "impactrueno" },
      { texto: "🛡️ ESPERAR Y CONTRAATACAR", destino: "esperar" }
    ]
  },

  /* -------------------- IMPACTRUENO (final feliz) ------------------- */
  impactrueno: {
    titulo: "TURNO 3 · GOLPE FINAL",
    texto:
      "Pikachu carga toda su electricidad y salta.\n" +
      "Un relámpago ilumina el camino completo.\n\n" +
      "¡IMPACTRUENO DEFINITIVO!",
    efectos: { vidaRival: -80, vidaJugador: -15 },
    acciones: [{ texto: "Ver el resultado", destino: "finalVictoria" }]
  },

  finalVictoria: {
    final: "ganaste",
    texto:
      "¡Ganaste la batalla! 🎉\n" +
      "El Gengar se desvanece entre las sombras y el camino queda libre.\n" +
      "Pikachu te mira orgulloso: «¡Pika pi!»"
  },

  /* ------------------ ESPERAR (camino más largo) ------------------- */
  esperar: {
    titulo: "TURNO 3 · ESPERAR",
    texto:
      "Pikachu espera el momento justo.\n" +
      "Gengar lanza un último ataque, pero se cansa demasiado...",
    efectos: { vidaJugador: -25, vidaRival: -20 },
    acciones: [{ texto: "Continuar", destino: "turno4" }]
  },

  /* ---------------------------- TURNO 4 ---------------------------- */
  turno4: {
    titulo: "TURNO 4",
    texto:
      "Los dos están al límite.\n" +
      "Gengar respira agitado y vos tenés la última decisión del combate.",
    acciones: [
      { texto: "⚡ ATACAR CON TODO", destino: "finalVictoria" },
      { texto: "🧪 BUSCAR UNA POCIÓN EXTRA", destino: "finalDerrota" }
    ]
  },

  finalDerrota: {
    final: "perdiste",
    texto:
      "Rebuscás en la mochila... no queda ninguna poción.\n" +
      "Gengar aprovecha ese segundo y lanza Bola Sombra.\n\n" +
      "Perdiste la batalla... 😵"
  },

  /* ----------------------------- HUIR ----------------------------- */
  huida: {
    titulo: "TURNO 1 · HUIDA",
    texto:
      "Intentás correr, pero Gengar aparece delante tuyo riéndose.\n" +
      "No hay escapatoria: hay que pelear.",
    efectos: { vidaJugador: -15 },
    acciones: [{ texto: "Continuar", destino: "turno2" }]
  }
};

/* ----------------------------------------------------------------------------
   AYUDANTE: buscar una situación por su nombre
   ---------------------------------------------------------------------------- */
export function buscarSituacion(nombre) {
  for (const clave in guion) {
    if (clave === nombre) return guion[clave];
  }
  return null;
}
