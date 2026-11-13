/* ============================================================================
   vistaBatalla.js  ->  PANTALLA 7:  BATALLA POR DECISIONES
   ============================================================================
   Es una EXPERIENCIA GUIONADA:
     · cada situación del guion tiene un texto y botones de acción
     · al elegir, se aplican "efectos" (por ejemplo -35 de vida)
     · la vida se dibuja en barras de colores
     · se avanza hasta un final (ganaste / perdiste)

   La vida de la batalla se guarda aparte en sessionStorage, para no
   mezclarla con los datos de la Pokédex del localStorage.
   ============================================================================ */

import { irA } from "./router.js";
import {
  guion,
  TURNO_INICIAL,
  VIDA_MAXIMA_JUGADOR,
  VIDA_MAXIMA_RIVAL,
  TU_POKEMON,
  POKEMON_RIVAL
} from "./guionBatalla.js";
import { buscarPokemonPorId } from "./almacenamiento.js";
import { escaparHTML, sonar } from "./utilidades.js";

/* Clave donde guardamos el estado de la pelea */
const CLAVE_BATALLA = "pokeapp_batalla";

/* ============================================================================
   1) ESTADO DE LA BATALLA
   ============================================================================ */
function estadoInicial() {
  return {
    situacion: TURNO_INICIAL,
    vidaJugador: VIDA_MAXIMA_JUGADOR,
    vidaRival: VIDA_MAXIMA_RIVAL,
    historial: []
  };
}

/* Leer el estado guardado (o crear uno nuevo) */
function leerEstado() {
  const texto = sessionStorage.getItem(CLAVE_BATALLA);

  if (texto === null) {
    const nuevo = estadoInicial();
    guardarEstado(nuevo);
    return nuevo;
  }

  try {
    return JSON.parse(texto);
  } catch (error) {
    const nuevo = estadoInicial();
    guardarEstado(nuevo);
    return nuevo;
  }
}

function guardarEstado(estado) {
  sessionStorage.setItem(CLAVE_BATALLA, JSON.stringify(estado));
}

function reiniciarBatalla() {
  sessionStorage.removeItem(CLAVE_BATALLA);
}

/* ============================================================================
   2) IMÁGENES
   Buscamos el sprite en la Pokédex para no repetir rutas a mano
   ============================================================================ */
function imagenDe(nombrePokemon) {
  const ids = [1, 4, 7, 25, 39, 52, 94, 133];

  for (let i = 0; i < ids.length; i++) {
    const pokemon = buscarPokemonPorId(ids[i]);

    if (pokemon && pokemon.nombre.toLowerCase() === nombrePokemon.toLowerCase()) {
      return pokemon.imagen;
    }
  }

  return "./assets/img/pokeball.png";
}

/* ============================================================================
   3) HTML DE LA VISTA
   ============================================================================ */
export function dibujarBatalla() {
  return `
    <section class="vista" data-vista="batalla">

      <h1 class="titulo-pantalla">Batalla</h1>
      <p class="subtitulo">Cada decisión cambia el rumbo de la pelea.</p>

      <div class="arena">

        <!-- ============ RIVAL ============ -->
        <div class="arena__combatientes">
          <div class="combatiente combatiente--rival">
            <img class="combatiente__sprite" id="spriteRival" src="${imagenDe("Gengar")}" alt="Gengar" />

            <div class="marco-info">
              <strong>${escaparHTML(POKEMON_RIVAL)}</strong>
              <div class="barra-vida" id="barraRival"><div></div></div>
            </div>
          </div>

          <!-- ============ TU POKÉMON ============ -->
          <div class="combatiente">
            <img class="combatiente__sprite" id="spriteJugador" src="${imagenDe("Pikachu")}" alt="Pikachu" />

            <div class="marco-info">
              <strong>${escaparHTML(TU_POKEMON)}</strong>
              <div class="barra-vida" id="barraJugador"><div></div></div>
            </div>
          </div>
        </div>

        <!-- ============ CAJA DE DIÁLOGO ============ -->
        <div class="dialogo" id="dialogoBatalla"></div>
      </div>

      <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn--gris" id="btnReiniciar">↺ Reiniciar batalla</button>
        <button class="btn btn--gris" data-ir="inicio">← Volver al inicio</button>
        <button class="btn btn--azul" data-ir="pokedex">Ver la Pokédex</button>
      </div>

    </section>
  `;
}

/* ============================================================================
   4) EVENTOS
   ============================================================================ */
export function activarBatalla() {
  document.querySelectorAll('[data-vista="batalla"] [data-ir]').forEach((boton) => {
    boton.addEventListener("click", () => irA(boton.dataset.ir));
  });

  document.getElementById("btnReiniciar").addEventListener("click", () => {
    reiniciarBatalla();
    irA("batalla");
  });

  dibujarSituacion();
}

/* ============================================================================
   5) DIBUJAR LA SITUACIÓN ACTUAL
   ============================================================================ */
function dibujarSituacion() {
  const estado = leerEstado();
  const dialogo = document.getElementById("dialogoBatalla");
  const situacion = guion[estado.situacion];

  pintarBarras(estado);

  // Si la situación no existe (no debería pasar), mostramos derrota
  if (situacion === undefined) {
    dialogo.innerHTML = cajaFinal("perdiste");
    conectarBotonesFinales(dialogo);
    return;
  }

  // Situación FINAL
  if (situacion.final) {
    dialogo.innerHTML = cajaFinal(situacion.final);
    conectarBotonesFinales(dialogo);
    return;
  }

  // Situación normal: etiqueta + texto + botones
  let botones = "";

  for (let i = 0; i < situacion.acciones.length; i++) {
    botones +=
      '<button class="btn btn--rojo" data-accion="' +
      i +
      '">' +
      situacion.acciones[i].texto +
      "</button>";
  }

  dialogo.innerHTML = `
    <span class="turno-etiqueta">${situacion.titulo}</span>
    <p class="dialogo__texto">${escaparHTML(situacion.texto)}</p>
    <div class="dialogo__acciones">${botones}</div>
  `;

  // Cada botón llama a elegirAccion con SU acción
  // Guardamos las acciones en una copia para que el click use siempre
  // los datos de ESTA situación y no los de la pantalla que venga después.
  const accionesDeEstaSituacion = situacion.acciones.slice();

  const listaBotones = dialogo.querySelectorAll("[data-accion]");

  listaBotones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const indice = Number(boton.dataset.accion);
      elegirAccion(accionesDeEstaSituacion[indice]);
    });
  });
}

/* ============================================================================
   6) EL JUGADOR ELIGE UNA ACCIÓN
   ============================================================================ */
function elegirAccion(accion) {
  let estado = leerEstado();

  // 1) Nos movemos a la situación destino
  const destino = accion.destino;
  const situacionDestino = guion[destino];

  estado.situacion = destino;
  estado.historial.push(accion.texto);

  // 2) Aplicamos los efectos de la acción...
  if (accion.efectos) {
    aplicarEfectos(estado, accion.efectos);
  }

  // ...y los efectos de la situación a la que entramos (si tiene)
  if (situacionDestino && situacionDestino.efectos) {
    aplicarEfectos(estado, situacionDestino.efectos);
  }

  guardarEstado(estado);

  // 3) Sonido y animación de golpe
  sonar("./assets/sound/hit.mp3");
  animarGolpe(estado);

  // 4) Revisamos si alguien llegó a 0 de vida
  if (estado.vidaJugador <= 0) {
    terminar("perdiste");
    return;
  }

  if (estado.vidaRival <= 0) {
    terminar("ganaste");
    return;
  }

  // 5) Si el destino es un final del guion, lo mostramos
  if (situacionDestino && situacionDestino.final) {
    terminar(situacionDestino.final);
    return;
  }

  // 6) Si no, dibujamos la próxima situación
  dibujarSituacion();
}

/* ============================================================================
   7) EFECTOS SOBRE LA VIDA
   ============================================================================ */
function aplicarEfectos(estado, efectos) {
  if (efectos.vidaJugador) {
    estado.vidaJugador = limitar(estado.vidaJugador + efectos.vidaJugador, 0, VIDA_MAXIMA_JUGADOR);
  }

  if (efectos.vidaRival) {
    estado.vidaRival = limitar(estado.vidaRival + efectos.vidaRival, 0, VIDA_MAXIMA_RIVAL);
  }
}

function limitar(valor, minimo, maximo) {
  if (valor < minimo) return minimo;
  if (valor > maximo) return maximo;
  return valor;
}

/* ============================================================================
   8) FINAL DE LA BATALLA
   ============================================================================ */
function terminar(resultado) {
  const estado = leerEstado();
  estado.situacion = resultado === "ganaste" ? "finalVictoria" : "finalDerrota";
  guardarEstado(estado);

  const dialogo = document.getElementById("dialogoBatalla");

  if (resultado === "ganaste") {
    sonar("./assets/sound/win.mp3");
  } else {
    sonar("./assets/sound/lose.mp3");
  }

  dialogo.innerHTML = cajaFinal(resultado);
  conectarBotonesFinales(dialogo);
  pintarBarras(estado);
}

function cajaFinal(resultado) {
  if (resultado === "ganaste") {
    return `
      <span class="turno-etiqueta">FIN · VICTORIA</span>
      <p class="dialogo__texto">¡Ganaste la batalla! 🎉
El Gengar se desvanece entre las sombras y el camino queda libre.
Pikachu te mira orgulloso: «¡Pika pi!»</p>
      <div class="dialogo__acciones">
        <button class="btn btn--rojo" data-reiniciar="1">Jugar otra vez</button>
        <button class="btn btn--azul" data-salir-final="pokedex">Ver la Pokédex</button>
      </div>
    `;
  }

  return `
    <span class="turno-etiqueta">FIN · DERROTA</span>
    <p class="dialogo__texto">Perdiste la batalla... 😵
Pikachu se quedó sin fuerzas y hay que volver al Centro Pokémon.</p>
    <div class="dialogo__acciones">
      <button class="btn btn--rojo" data-reiniciar="1">Reintentar</button>
      <button class="btn btn--gris" data-salir-final="inicio">Volver al inicio</button>
    </div>
  `;
}

function conectarBotonesFinales(dialogo) {
  dialogo.querySelectorAll("[data-reiniciar]").forEach((boton) => {
    boton.addEventListener("click", () => {
      reiniciarBatalla();
      irA("batalla");
    });
  });

  dialogo.querySelectorAll("[data-salir-final]").forEach((boton) => {
    boton.addEventListener("click", () => irA(boton.dataset.salirFinal));
  });
}

/* ============================================================================
   9) BARRAS DE VIDA
   ============================================================================ */
function pintarBarras(estado) {
  const barraJugador = document.querySelector("#barraJugador div");
  const barraRival = document.querySelector("#barraRival div");

  if (!barraJugador || !barraRival) return;

  const porcentajeJugador = (estado.vidaJugador / VIDA_MAXIMA_JUGADOR) * 100;
  const porcentajeRival = (estado.vidaRival / VIDA_MAXIMA_RIVAL) * 100;

  barraJugador.style.width = porcentajeJugador + "%";
  barraRival.style.width = porcentajeRival + "%";

  // El color cambia según cuánta vida queda
  barraJugador.className = colorDeVida(porcentajeJugador);
  barraRival.className = colorDeVida(porcentajeRival);
}

function colorDeVida(porcentaje) {
  if (porcentaje <= 25) return "bajo";
  if (porcentaje <= 55) return "medio";
  return "";
}

/* ============================================================================
   10) ANIMACIÓN DE GOLPE
   ============================================================================ */
function animarGolpe(estado) {
  if (estado.vidaJugador <= 0) return;

  // Si el rival bajó de vida, animamos al rival; si no, al jugador
  const sprite = document.getElementById("spriteJugador");
  if (!sprite) return;

  sprite.classList.add("golpeado");
  setTimeout(() => sprite.classList.remove("golpeado"), 400);
}
