/* ============================================================================
   vistaPokedex.js  ->  PANTALLA 2:  POKÉDEX
   ============================================================================
   Muestra TODOS los Pokémon guardados en tarjetas.
   Además tiene (opcionales según la consigna, pero suman):
     · buscador por nombre
     · filtro por tipo
     · filtro por rareza
   Siempre lee los datos actuales desde el almacenamiento, por eso si el
   admin carga uno nuevo, aparece automáticamente.
   ============================================================================ */

import { irA } from "./router.js";
import { obtenerPokemon } from "./almacenamiento.js";
import { escaparHTML, formatearNumero, sonar, nombreTipoClase } from "./utilidades.js";

/* ----------------------------------------------------------------------------
   UNA TARJETA DE POKÉMON
   Recibe un objeto pokemon y devuelve su HTML
   ---------------------------------------------------------------------------- */
function tarjetaPokemon(pokemon) {
  // Los tipos se muestran como chips de colores
  let chips = "";
  for (let i = 0; i < pokemon.tipo.length; i++) {
    const tipo = pokemon.tipo[i];
    chips += '<span class="chip chip--' + nombreTipoClase(tipo) + '">' + escaparHTML(tipo) + "</span>";
  }

  const estrella = pokemon.shiny ? '<span class="estrella" title="Tiene versión shiny">✨</span>' : "";

  return `
    <article class="tarjeta-pokemon" data-tipo="${escaparHTML(pokemon.tipo[0])}" data-id="${pokemon.id}">
      <span class="numero">${formatearNumero(pokemon.id)}</span>
      ${estrella}

      <img src="${escaparHTML(pokemon.imagen)}"
           alt="Imagen de ${escaparHTML(pokemon.nombre)}"
           loading="lazy"
           onerror="this.src='./assets/img/pokeball.png'" />

      <h3>${escaparHTML(pokemon.nombre)}</h3>

      <div class="chips">${chips}</div>
      <span class="rareza">Rareza: ${escaparHTML(pokemon.rareza)}</span>

      <div class="tarjeta-pokemon__acciones">
        <button class="btn btn--azul btn--chico" data-detalle="${pokemon.id}">Ver detalle</button>
        <button class="btn btn--gris btn--chico" data-sonido="${pokemon.id}" title="Escuchar su grito">🔊</button>
      </div>
    </article>
  `;
}

/* ----------------------------------------------------------------------------
   HTML DE LA PANTALLA
   ---------------------------------------------------------------------------- */
export function dibujarPokedex() {
  const pokemon = obtenerPokemon();

  // Sacamos la lista de tipos sin repetir (para el <select> del filtro)
  const tipos = obtenerListaDeTipos(pokemon);

  let opcionesTipo = '<option value="todos">Todos los tipos</option>';
  for (let i = 0; i < tipos.length; i++) {
    opcionesTipo += '<option value="' + escaparHTML(tipos[i]) + '">' + escaparHTML(tipos[i]) + "</option>";
  }

  return `
    <section class="vista" data-vista="pokedex">

      <h1 class="titulo-pantalla">Pokédex</h1>
      <p class="subtitulo">Tocá una tarjeta para ver toda la información del Pokémon.</p>

      <!-- ================= BUSCADOR Y FILTROS ================= -->
      <div class="barra-busqueda">
        <input type="search" id="buscarPokemon" placeholder="Buscar por nombre..." />
        <select id="filtroTipo">${opcionesTipo}</select>
        <select id="filtroRareza">
          <option value="todos">Todas las rarezas</option>
          <option value="Común">Común</option>
          <option value="Raro">Raro</option>
          <option value="Épico">Épico</option>
          <option value="Legendario">Legendario</option>
        </select>
        <span class="contador" id="contadorPokemon"></span>
      </div>

      <!-- ================= TARJETAS ================= -->
      <div class="grid-pokemon" id="gridPokemon"></div>

      <div style="margin-top:24px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn--gris" data-ir="inicio">← Volver al inicio</button>
        <button class="btn btn--rojo" data-ir="batalla">Ir a la batalla →</button>
      </div>

    </section>
  `;
}

/* ----------------------------------------------------------------------------
   LISTA DE TIPOS SIN REPETIR
   Recorremos todos los Pokémon y todos sus tipos con un array auxiliar.
   ---------------------------------------------------------------------------- */
function obtenerListaDeTipos(pokemon) {
  const tipos = [];

  for (let i = 0; i < pokemon.length; i++) {
    for (let j = 0; j < pokemon[i].tipo.length; j++) {
      const tipo = pokemon[i].tipo[j];
      if (!tipos.includes(tipo)) {
        tipos.push(tipo);
      }
    }
  }

  return tipos.sort();
}

/* ----------------------------------------------------------------------------
   DIBUJAR LAS TARJETAS APLICANDO LOS FILTROS
   ---------------------------------------------------------------------------- */
function renderizarTarjetas() {
  const grid = document.getElementById("gridPokemon");
  const contador = document.getElementById("contadorPokemon");
  const texto = document.getElementById("buscarPokemon").value.toLowerCase().trim();
  const tipoElegido = document.getElementById("filtroTipo").value;
  const rarezaElegida = document.getElementById("filtroRareza").value;

  const pokemon = obtenerPokemon();
  let html = "";
  let cantidad = 0;

  // RECORRIDO de los datos + ESTRUCTURAS DE CONTROL para filtrar
  for (let i = 0; i < pokemon.length; i++) {
    const p = pokemon[i];

    const coincideNombre = p.nombre.toLowerCase().includes(texto);
    const coincideTipo = tipoElegido === "todos" || p.tipo.includes(tipoElegido);
    const coincideRareza = rarezaElegida === "todos" || p.rareza === rarezaElegida;

    if (coincideNombre && coincideTipo && coincideRareza) {
      html += tarjetaPokemon(p);
      cantidad++;
    }
  }

  if (cantidad === 0) {
    html =
      '<div class="sin-resultados">No encontramos Pokémon con esos filtros 🕵️<br>Probá con otro nombre o tipo.</div>';
  }

  grid.innerHTML = html;
  contador.textContent = cantidad + " de " + pokemon.length + " Pokémon";
}

/* ----------------------------------------------------------------------------
   EVENTOS
   ---------------------------------------------------------------------------- */
export function activarPokedex() {
  const buscador = document.getElementById("buscarPokemon");
  const filtroTipo = document.getElementById("filtroTipo");
  const filtroRareza = document.getElementById("filtroRareza");
  const grid = document.getElementById("gridPokemon");

  // El evento "input" se dispara cada vez que se escribe una letra
  buscador.addEventListener("input", renderizarTarjetas);
  filtroTipo.addEventListener("change", renderizarTarjetas);
  filtroRareza.addEventListener("change", renderizarTarjetas);

  // Delegación de eventos: escuchamos el click en el contenedor
  // y averiguamos qué tarjeta/botón se tocó
  grid.addEventListener("click", (evento) => {
    const botonDetalle = evento.target.closest("[data-detalle]");
    if (botonDetalle) {
      irA("detalle", Number(botonDetalle.dataset.detalle));
      return;
    }

    const botonSonido = evento.target.closest("[data-sonido]");
    if (botonSonido) {
      const pokemon = obtenerPokemon().find((p) => p.id === Number(botonSonido.dataset.sonido));
      if (pokemon) sonar(pokemon.sonido);
      return;
    }

    // Si tocaron la tarjeta (no un botón), también abrimos el detalle
    const tarjeta = evento.target.closest(".tarjeta-pokemon");
    if (tarjeta) {
      irA("detalle", Number(tarjeta.dataset.id));
    }
  });

  // Botones de abajo (volver / batalla)
  document.querySelectorAll('[data-vista="pokedex"] [data-ir]').forEach((boton) => {
    boton.addEventListener("click", () => irA(boton.dataset.ir));
  });

  renderizarTarjetas();
}
