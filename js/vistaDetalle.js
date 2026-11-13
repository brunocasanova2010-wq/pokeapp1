/* ============================================================================
   vistaDetalle.js  ->  PANTALLA 3:  DETALLE DE POKÉMON
   ============================================================================
   IMPORTANTE: acá NO escribimos los datos a mano.
   Buscamos el Pokémon en el almacenamiento usando su id y mostramos
   los valores de ESE objeto. Si el admin cambia los datos, se ven los nuevos.
   ============================================================================ */

import { irA } from "./router.js";
import { buscarPokemonPorId } from "./almacenamiento.js";
import { escaparHTML, formatearNumero, sonar, nombreTipoClase } from "./utilidades.js";

/* ----------------------------------------------------------------------------
   HTML DE LA VISTA
   Recibe el id del Pokémon que se quiere ver
   ---------------------------------------------------------------------------- */
export function dibujarDetalle(id) {
  const pokemon = buscarPokemonPorId(id);

  // Si el id no existe (o alguien escribió #detalle en la URL), avisamos
  if (pokemon === null) {
    return `
      <section class="vista">
        <h1 class="titulo-pantalla">Pokémon no encontrado</h1>
        <p class="subtitulo">No existe un Pokémon con ese número.</p>
        <button class="btn btn--rojo" data-ir="pokedex">Volver a la Pokédex</button>
      </section>
    `;
  }

  // Chips de tipos
  let chips = "";
  for (let i = 0; i < pokemon.tipo.length; i++) {
    const tipo = pokemon.tipo[i];
    chips += '<span class="chip chip--' + nombreTipoClase(tipo) + '">' + escaparHTML(tipo) + "</span>";
  }

  return `
    <section class="vista" data-vista="detalle" data-pokemon="${pokemon.id}">

      <h1 class="titulo-pantalla">Detalle de Pokémon</h1>

      <div class="detalle">

        <!-- ============ COLUMNA IZQUIERDA: imagen ============ -->
        <div class="detalle__arte" data-tipo="${escaparHTML(pokemon.tipo[0])}">
          <span class="detalle__numero">${formatearNumero(pokemon.id)}</span>

          <img id="imagenDetalle"
               src="${escaparHTML(pokemon.imagen)}"
               alt="Imagen de ${escaparHTML(pokemon.nombre)}" />

          <div class="chips" style="justify-content:center;margin-top:12px">${chips}</div>

          <div style="display:flex;gap:8px;justify-content:center;margin-top:16px;flex-wrap:wrap">
            <button class="btn btn--gris btn--chico" id="btnSonido">🔊 Escuchar grito</button>

            ${pokemon.shiny
                ? '<button class="btn btn--amarillo btn--chico detalle__shiny" id="btnShiny">✨ Ver versión shiny</button>'
                : ""}
          </div>
        </div>

        <!-- ============ COLUMNA DERECHA: información ============ -->
        <div class="detalle__info">
          <h2>${escaparHTML(pokemon.nombre)}</h2>
          <span class="chip chip--${escaparHTML(pokemon.rareza)}">${escaparHTML(pokemon.rareza)}</span>

          <p class="detalle__desc">${escaparHTML(pokemon.descripcion)}</p>

          <!-- Datos generales -->
          <div class="datos-grid">
            <div class="dato"><span>Altura</span><strong>${pokemon.altura} m</strong></div>
            <div class="dato"><span>Peso</span><strong>${pokemon.peso} kg</strong></div>
            <div class="dato"><span>Generación</span><strong>${pokemon.generacion}ª</strong></div>
            <div class="dato"><span>Habilidad</span><strong>${escaparHTML(pokemon.habilidad)}</strong></div>
          </div>

          <!-- Estadísticas con barras -->
          <div class="stats">
            ${barraEstadistica("HP", pokemon.hp, 150)}
            ${barraEstadistica("Ataque", pokemon.ataque, 150)}
            ${barraEstadistica("Defensa", pokemon.defensa, 150)}
            ${barraEstadistica("Velocidad", pokemon.velocidad, 150)}
          </div>

          <!-- Evolución -->
          <div class="info-extra">
            <div>
              <span>¿Tiene evolución?</span>
              <span>${pokemon.tieneEvolucion ? "Sí" : "No"}</span>
            </div>
            <div>
              <span>Evoluciona a</span>
              <span>${escaparHTML(pokemon.evolucion)}</span>
            </div>
            <div>
              <span>Nivel de evolución</span>
              <span>${pokemon.tieneEvolucion ? pokemon.nivelEvolucion : "—"}</span>
            </div>
            <div>
              <span>Shiny disponible</span>
              <span>${pokemon.shiny ? "Sí ✨" : "No"}</span>
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top:24px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn--gris" data-ir="pokedex">← Volver a la Pokédex</button>
        <button class="btn btn--azul" data-ir="batalla">Ir a la batalla →</button>
      </div>

    </section>
  `;
}

/* ----------------------------------------------------------------------------
   BARRA DE ESTADÍSTICA
   Calcula el ancho en % según el máximo posible (150)
   ---------------------------------------------------------------------------- */
function barraEstadistica(nombre, valor, maximo) {
  let porcentaje = (valor / maximo) * 100;
  if (porcentaje > 100) porcentaje = 100;

  return `
    <div class="stat">
      <span>${nombre}</span>
      <div class="stat__barra"><div class="stat__relleno" style="width:${porcentaje}%"></div></div>
      <span class="stat__valor">${valor}</span>
    </div>
  `;
}

/* ----------------------------------------------------------------------------
   EVENTOS
   ---------------------------------------------------------------------------- */
export function activarDetalle(id) {
  const pokemon = buscarPokemonPorId(id);
  if (pokemon === null) {
    document.querySelector("[data-ir='pokedex']").addEventListener("click", () => irA("pokedex"));
    return;
  }

  // Botón para escuchar el grito
  document.getElementById("btnSonido").addEventListener("click", () => {
    sonar(pokemon.sonido);
  });

  // Botón shiny: cambia la imagen entre normal y shiny
  const btnShiny = document.getElementById("btnShiny");
  const imagen = document.getElementById("imagenDetalle");

  if (btnShiny) {
    let mostrandoShiny = false;

    btnShiny.addEventListener("click", () => {
      mostrandoShiny = !mostrandoShiny;

      imagen.src = mostrandoShiny ? pokemon.imagenShiny : pokemon.imagen;
      btnShiny.textContent = mostrandoShiny ? "↩ Ver versión normal" : "✨ Ver versión shiny";
    });
  }

  // Botones de navegación de abajo
  document.querySelectorAll('[data-vista="detalle"] [data-ir]').forEach((boton) => {
    boton.addEventListener("click", () => irA(boton.dataset.ir));
  });
}
