/* ============================================================================
   vistaInicio.js  ->  PANTALLA 1:  LANDING / INICIO
   ============================================================================
   Muestra una presentación de la app y atajos a las demás secciones.
   ============================================================================ */

import { irA } from "./router.js";
import { usuarioActual } from "./usuarios.js";
import { obtenerPokemon } from "./almacenamiento.js";

/* ----------------------------------------------------------------------------
   HTML de la vista (se pega dentro de <main id="app">)
   ---------------------------------------------------------------------------- */
export function dibujarInicio() {
  const usuario = usuarioActual();
  const totalPokemon = obtenerPokemon().length;

  // Si hay usuario logueado mostramos un saludo personalizado
  const saludo = usuario
    ? '<p class="subtitulo">¡Hola de nuevo, <strong>' +
      usuario.nombre +
      "</strong>! Elegí a dónde querés ir hoy.</p>"
    : '<p class="subtitulo">Explorá la Pokédex, hacé una batalla o creá tu cuenta.</p>';

  return `
    <section class="vista" data-vista="inicio">

      <!-- ================= HERO (presentación) ================= -->
      <div class="hero">
        <div>
          <h1>Tu Pokédex <em>interactiva</em><br>en el navegador</h1>
          <p>
            PokeApp reúne ${totalPokemon} Pokémon con sus datos, tipos, estadísticas y
            sonidos. Consultá la Pokédex, abrí el detalle de cada uno, hacé una
            batalla por turnos o registrate para guardar tu progreso.
          </p>
          ${saludo}
          <div class="hero__acciones">
            <button class="btn btn--amarillo" data-ir="pokedex">Abrir la Pokédex</button>
            <button class="btn btn--fantasma" data-ir="batalla">Ir a la batalla</button>
            ${usuario ? "" : '<button class="btn btn--fantasma" data-ir="registro">Crear cuenta</button>'}
          </div>
        </div>

        <div class="hero__arte">
          <img src="./assets/img/p25.png" alt="Pikachu" />
        </div>
      </div>

      <!-- ================= ACCESOS RÁPIDOS ================= -->
      <div class="atajos">
        <button class="atajo" data-ir="pokedex">
          <span class="atajo__emoji">📕</span>
          <strong>Pokédex</strong>
          <small>Todos los Pokémon con su número, imagen, tipo y rareza.</small>
        </button>

        <button class="atajo" data-ir="batalla">
          <span class="atajo__emoji">⚔️</span>
          <strong>Batalla por turnos</strong>
          <small>Elegí atacar o usar una poción y llegá al final de la historia.</small>
        </button>

        <button class="atajo" data-ir="login">
          <span class="atajo__emoji">🔑</span>
          <strong>Iniciar sesión</strong>
          <small>Entrá con tu usuario. El admin también puede cargar Pokémon.</small>
        </button>

        <button class="atajo" data-ir="carga">
          <span class="atajo__emoji">➕</span>
          <strong>Cargar Pokémon</strong>
          <small>Sólo administradores. El Pokémon nuevo queda guardado.</small>
        </button>
      </div>

    </section>
  `;
}

/* ----------------------------------------------------------------------------
   EVENTOS de la vista
   Se llaman justo después de pegar el HTML en la página.
   ---------------------------------------------------------------------------- */
export function activarInicio() {
  // Todos los botones/atajos con data-ir navegan a otra vista
  const botones = document.querySelectorAll('[data-vista="inicio"] [data-ir]');

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      irA(boton.dataset.ir);
    });
  });
}
