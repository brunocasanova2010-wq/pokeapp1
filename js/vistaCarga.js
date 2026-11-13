/* ============================================================================
   vistaCarga.js  ->  PANTALLA 6:  CARGA DE POKÉMON (sólo administradores)
   ============================================================================ */

import { irA } from "./router.js";
import { esAdmin, usuarioActual } from "./usuarios.js";
import { agregarPokemon, proximoIdPokemon, obtenerPokemon } from "./almacenamiento.js";
import { mostrarToast, sonar, escaparHTML, formatearNumero } from "./utilidades.js";

/* Tipos y rarezas permitidos en los <select> */
const TIPOS = ["Planta", "Fuego", "Agua", "Eléctrico", "Normal", "Fantasma", "Veneno", "Hada"];
const RAREZAS = ["Común", "Raro", "Épico", "Legendario"];

/* ----------------------------------------------------------------------------
   ARMAR LAS OPCIONES DE UN <select>
   ---------------------------------------------------------------------------- */
function opciones(lista) {
  let html = "";
  for (let i = 0; i < lista.length; i++) {
    html += '<option value="' + lista[i] + '">' + lista[i] + "</option>";
  }
  return html;
}

/* ----------------------------------------------------------------------------
   HTML DE LA VISTA
   ---------------------------------------------------------------------------- */
export function dibujarCarga() {
  // 1) ¿Hay alguien logueado?
  const usuario = usuarioActual();

  if (usuario === null) {
    return `
      <section class="vista" data-vista="bloqueada">
        <div class="sin-sesion">
          <h2>Necesitás iniciar sesión</h2>
          <p class="subtitulo">Esta sección es sólo para administradores.</p>
          <button class="btn btn--rojo" data-ir="login">Iniciar sesión</button>
        </div>
      </section>
    `;
  }

  // 2) ¿Es administrador?
  if (!esAdmin()) {
    return `
      <section class="vista" data-vista="bloqueada">
        <div class="sin-sesion">
          <h2>Acceso restringido</h2>
          <p class="subtitulo">
            Hola ${escaparHTML(usuario.nombre)}, tu cuenta no tiene permisos de administrador.
            Probá entrando con el usuario <strong>admin</strong>.
          </p>
          <button class="btn btn--gris" data-ir="pokedex">Ir a la Pokédex</button>
        </div>
      </section>
    `;
  }

  // 3) Es admin: mostramos el formulario
  const proximoId = proximoIdPokemon();

  return `
    <section class="vista" data-vista="carga">
      <h1 class="titulo-pantalla">Cargar Pokémon</h1>
      <p class="subtitulo">
        Sesión de administrador: <strong>${escaparHTML(usuario.nombre)}</strong>.
        El Pokémon nuevo se guarda y aparece en la Pokédex.
      </p>

      <form class="panel-formulario panel-formulario--ancho" id="formCarga" novalidate>

        <div class="mensaje-error" id="errorCarga"></div>

        <div class="fila">
          <div class="campo">
            <label for="nombrePokemon">Nombre *</label>
            <input type="text" id="nombrePokemon" placeholder="Ej: Mewtwo" />
          </div>

          <div class="campo">
            <label for="idPokemon">Número / ID</label>
            <input type="number" id="idPokemon" value="${proximoId}" min="1" />
            <small>Se sugiere el próximo número libre.</small>
          </div>
        </div>

        <div class="fila--3 fila">
          <div class="campo">
            <label for="tipo1">Tipo principal *</label>
            <select id="tipo1">${opciones(TIPOS)}</select>
          </div>
          <div class="campo">
            <label for="tipo2">Tipo secundario</label>
            <select id="tipo2"><option value="">Sin segundo tipo</option>${opciones(TIPOS)}</select>
          </div>
          <div class="campo">
            <label for="rarezaPokemon">Rareza *</label>
            <select id="rarezaPokemon">${opciones(RAREZAS)}</select>
          </div>
        </div>

        <div class="campo">
          <label for="descripcionPokemon">Descripción *</label>
          <textarea id="descripcionPokemon" placeholder="Contá algo sobre este Pokémon..."></textarea>
        </div>

        <div class="fila--3 fila">
          <div class="campo">
            <label for="altura">Altura (m) *</label>
            <input type="number" id="altura" step="0.1" min="0" placeholder="0.7" />
          </div>
          <div class="campo">
            <label for="peso">Peso (kg) *</label>
            <input type="number" id="peso" step="0.1" min="0" placeholder="6.9" />
          </div>
          <div class="campo">
            <label for="generacion">Generación *</label>
            <input type="number" id="generacion" min="1" max="9" placeholder="1" />
          </div>
        </div>

        <div class="fila--3 fila">
          <div class="campo"><label for="hp">HP *</label><input type="number" id="hp" min="1" max="255" placeholder="45" /></div>
          <div class="campo"><label for="ataque">Ataque *</label><input type="number" id="ataque" min="1" max="255" placeholder="49" /></div>
          <div class="campo"><label for="defensa">Defensa *</label><input type="number" id="defensa" min="1" max="255" placeholder="49" /></div>
        </div>

        <div class="fila">
          <div class="campo"><label for="velocidad">Velocidad *</label><input type="number" id="velocidad" min="1" max="255" placeholder="45" /></div>
          <div class="campo"><label for="habilidad">Habilidad *</label><input type="text" id="habilidad" placeholder="Espesura" /></div>
        </div>

        <div class="fila--3 fila">
          <div class="campo">
            <label for="tieneEvolucion">¿Tiene evolución?</label>
            <select id="tieneEvolucion">
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
          <div class="campo">
            <label for="evolucion">Evoluciona a</label>
            <input type="text" id="evolucion" placeholder="Ivysaur" />
          </div>
          <div class="campo">
            <label for="nivelEvolucion">Nivel de evolución</label>
            <input type="number" id="nivelEvolucion" min="0" value="0" />
          </div>
        </div>

        <div class="fila">
          <div class="campo">
            <label for="imagen">Imagen (ruta) *</label>
            <input type="text" id="imagen" placeholder="./assets/img/nuevo.png" />
            <small>Si la imagen no existe, se muestra una pokébola.</small>
          </div>
          <div class="campo">
            <label for="sonido">Sonido (ruta)</label>
            <input type="text" id="sonido" placeholder="./assets/sound/nuevo.mp3" />
          </div>
        </div>

        <div class="fila">
          <div class="campo">
            <label for="shiny">¿Tiene versión shiny?</label>
            <select id="shiny">
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
          <div class="campo">
            <label for="imagenShiny">Imagen shiny (ruta)</label>
            <input type="text" id="imagenShiny" placeholder="./assets/img/nuevo-shiny.png" />
          </div>
        </div>

        <div class="form-acciones">
          <button type="submit" class="btn btn--rojo">Guardar Pokémon</button>
          <button type="reset" class="btn btn--gris">Limpiar formulario</button>
          <button type="button" class="btn btn--azul" data-ir="pokedex">Ver la Pokédex</button>
        </div>
      </form>

      <div class="panel-formulario panel-formulario--ancho" style="margin-top:22px">
        <h3 style="margin-top:0">Pokémon ya cargados (${obtenerPokemon().length})</h3>
        <div id="listaCargados" style="display:flex;flex-wrap:wrap;gap:8px"></div>
      </div>
    </section>
  `;
}

/* ----------------------------------------------------------------------------
   EVENTOS (sólo si el formulario existe, o sea, si es admin)
   ---------------------------------------------------------------------------- */
export function activarCarga() {
  // Si la vista está bloqueada, sólo dejamos funcionar los botones de navegación
  const formulario = document.getElementById("formCarga");

  document.querySelectorAll('[data-ir]').forEach((boton) => {
    boton.addEventListener("click", () => irA(boton.dataset.ir));
  });

  if (!formulario) return;

  const cajaError = document.getElementById("errorCarga");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    // ============ 1) CAPTURAMOS TODOS LOS DATOS ============
    const nombre = document.getElementById("nombrePokemon").value.trim();
    const id = Number(document.getElementById("idPokemon").value);

    // Los tipos: el principal siempre, el secundario sólo si se eligió
    const tipo1 = document.getElementById("tipo1").value;
    const tipo2 = document.getElementById("tipo2").value;
    const tipo = tipo2 === "" || tipo2 === tipo1 ? [tipo1] : [tipo1, tipo2];

    const rareza = document.getElementById("rarezaPokemon").value;
    const descripcion = document.getElementById("descripcionPokemon").value.trim();

    // IMPORTANTE: los numéricos se convierten con Number() para que sean
    // números de verdad y no texto. Así después podemos sumar o comparar.
    const altura = Number(document.getElementById("altura").value);
    const peso = Number(document.getElementById("peso").value);
    const generacion = Number(document.getElementById("generacion").value);
    const hp = Number(document.getElementById("hp").value);
    const ataque = Number(document.getElementById("ataque").value);
    const defensa = Number(document.getElementById("defensa").value);
    const velocidad = Number(document.getElementById("velocidad").value);

    const habilidad = document.getElementById("habilidad").value.trim();

    const tieneEvolucion = document.getElementById("tieneEvolucion").value === "true";
    const evolucion = document.getElementById("evolucion").value.trim() || "No evoluciona";
    const nivelEvolucion = Number(document.getElementById("nivelEvolucion").value);

    const imagen = document.getElementById("imagen").value.trim();
    const sonido = document.getElementById("sonido").value.trim();

    const shiny = document.getElementById("shiny").value === "true";
    const imagenShiny = document.getElementById("imagenShiny").value.trim();

    // ============ 2) VALIDAMOS ============
    const mensaje = validar({ nombre, id, descripcion, altura, peso, generacion, hp, ataque, defensa, velocidad, habilidad, imagen });

    if (mensaje !== "") {
      cajaError.textContent = mensaje;
      cajaError.classList.add("visible");
      sonar("./assets/sound/error.mp3");
      return;
    }

    // ============ 3) CONSTRUIMOS EL OBJETO POKÉMON ============
    const pokemonNuevo = {
      id: id,
      nombre: nombre,
      tipo: tipo,
      descripcion: descripcion,
      altura: altura,
      peso: peso,
      generacion: generacion,
      hp: hp,
      ataque: ataque,
      velocidad: velocidad,
      defensa: defensa,
      habilidad: habilidad,
      tieneEvolucion: tieneEvolucion,
      evolucion: evolucion,
      nivelEvolucion: nivelEvolucion,
      rareza: rareza,
      imagen: imagen,
      sonido: sonido,
      shiny: shiny,
      imagenShiny: imagenShiny !== "" ? imagenShiny : imagen
    };

    // ============ 4) LO AGREGAMOS Y GUARDAMOS ============
    agregarPokemon(pokemonNuevo);

    // ============ 5) ACTUALIZAMOS LA PANTALLA ============
    sonar("./assets/sound/levelup.mp3");
    mostrarToast("¡" + pokemonNuevo.nombre + " agregado a la Pokédex!");

    // Volvemos a dibujar la vista para que la lista de abajo se actualice
    irA("carga");
  });

  // Lista chiquita de los Pokémon cargados
  const lista = obtenerPokemon();
  const contenedor = document.getElementById("listaCargados");
  let html = "";

  for (let i = 0; i < lista.length; i++) {
    html +=
      '<button class="btn btn--gris btn--chico" data-ver="' +
      lista[i].id +
      '">' +
      formatearNumero(lista[i].id) +
      " " +
      escaparHTML(lista[i].nombre) +
      "</button>";
  }

  contenedor.innerHTML = html;

  contenedor.querySelectorAll("[data-ver]").forEach((boton) => {
    boton.addEventListener("click", () => irA("detalle", Number(boton.dataset.ver)));
  });
}

/* ----------------------------------------------------------------------------
   VALIDACIÓN DEL FORMULARIO DE CARGA
   ---------------------------------------------------------------------------- */
function validar(datos) {
  if (datos.nombre.length < 3) return "El nombre del Pokémon debe tener al menos 3 letras.";
  if (!Number.isFinite(datos.id) || datos.id < 1) return "El ID debe ser un número mayor a 0.";
  if (datos.descripcion.length < 10) return "Escribí una descripción de al menos 10 caracteres.";

  // Comprobamos que no se repita el id ni el nombre
  const lista = obtenerPokemon();
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id === datos.id) return "Ya existe un Pokémon con el ID " + datos.id + ".";
    if (lista[i].nombre.toLowerCase() === datos.nombre.toLowerCase()) return "Ya existe un Pokémon con ese nombre.";
  }

  if (!(datos.altura > 0)) return "La altura debe ser un número mayor a 0.";
  if (!(datos.peso > 0)) return "El peso debe ser un número mayor a 0.";
  if (!(datos.generacion >= 1)) return "La generación debe ser 1 o más.";

  if (!(datos.hp > 0) || !(datos.ataque > 0) || !(datos.defensa > 0) || !(datos.velocidad > 0)) {
    return "HP, ataque, defensa y velocidad deben ser números mayores a 0.";
  }

  if (datos.habilidad === "") return "Escribí una habilidad.";
  if (datos.imagen === "") return "Indicá la ruta de la imagen (ej: ./assets/img/nuevo.png).";

  return "";
}
