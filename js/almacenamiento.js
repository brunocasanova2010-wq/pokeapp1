/* ============================================================================
   almacenamiento.js  ->  PERSISTENCIA CON JSON + localStorage
   ============================================================================
   Idea general:
   1) Buscamos si ya hay datos guardados en el navegador (localStorage).
   2) Si NO hay nada, cargamos los datos iniciales de datos.js.
   3) Cuando algo cambia (nuevo Pokémon, nuevo usuario, sesión),
      convertimos a JSON con JSON.stringify y lo guardamos.

   localStorage sólo guarda TEXTO, por eso usamos:
     · JSON.stringify(objeto)  -> objeto  a texto
     · JSON.parse(texto)       -> texto   a objeto
   ============================================================================ */

// Importamos los datos iniciales desde otro archivo (import / export)
import { pokemonIniciales, usuariosIniciales } from "./datos.js";

/* Nombres de las "cajas" donde guardamos cada cosa dentro del navegador */
const CLAVE_POKEMON = "pokeapp_pokemon";
const CLAVE_USUARIOS = "pokeapp_usuarios";
const CLAVE_SESION = "pokeapp_sesion";

/* ----------------------------------------------------------------------------
   FUNCIÓN GENÉRICA: leer del localStorage
   ---------------------------------------------------------------------------- */
function leerDeStorage(clave, valorPorDefecto) {
  const texto = localStorage.getItem(clave);

  if (texto === null) {
    // No había nada guardado: devolvemos una COPIA de los datos iniciales
    return copiar(valorPorDefecto);
  }

  try {
    return JSON.parse(texto);
  } catch (error) {
    // Si el texto guardado está roto, volvemos a los datos iniciales
    console.warn("No se pudo leer " + clave + ", se usan datos iniciales.");
    return copiar(valorPorDefecto);
  }
}

/* ----------------------------------------------------------------------------
   FUNCIÓN GENÉRICA: escribir en el localStorage
   ---------------------------------------------------------------------------- */
function guardarEnStorage(clave, valor) {
  const texto = JSON.stringify(valor);
  localStorage.setItem(clave, texto);
}

/* Copia profunda para no modificar los arrays originales de datos.js */
function copiar(valor) {
  return JSON.parse(JSON.stringify(valor));
}

/* ============================================================================
   POKÉMON
   ============================================================================ */
export function obtenerPokemon() {
  return leerDeStorage(CLAVE_POKEMON, pokemonIniciales);
}

export function guardarPokemon(lista) {
  guardarEnStorage(CLAVE_POKEMON, lista);
}

/* Agrega un Pokémon nuevo a la lista y guarda todo */
export function agregarPokemon(pokemonNuevo) {
  const lista = obtenerPokemon();
  lista.push(pokemonNuevo);
  guardarPokemon(lista);
  return lista;
}

/* Busca un Pokémon por su id. Devuelve el objeto o null */
export function buscarPokemonPorId(id) {
  const lista = obtenerPokemon();
  const numeroBuscado = Number(id);

  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id === numeroBuscado) {
      return lista[i];
    }
  }
  return null;
}

/* Calcula el próximo id libre (el más alto + 1) */
export function proximoIdPokemon() {
  const lista = obtenerPokemon();
  let maximo = 0;

  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id > maximo) {
      maximo = lista[i].id;
    }
  }
  return maximo + 1;
}

/* ============================================================================
   USUARIOS
   ============================================================================ */
export function obtenerUsuarios() {
  return leerDeStorage(CLAVE_USUARIOS, usuariosIniciales);
}

export function guardarUsuarios(lista) {
  guardarEnStorage(CLAVE_USUARIOS, lista);
}

export function proximoIdUsuario() {
  const lista = obtenerUsuarios();
  let maximo = 0;

  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id > maximo) {
      maximo = lista[i].id;
    }
  }
  return maximo + 1;
}

/* ============================================================================
   SESIÓN (quién está logueado ahora)
   Guardamos sólo el id del usuario que inició sesión.
   ============================================================================ */
export function obtenerSesion() {
  const guardado = localStorage.getItem(CLAVE_SESION);
  if (guardado === null) return null;

  try {
    return JSON.parse(guardado);
  } catch (error) {
    return null;
  }
}

export function guardarSesion(usuario) {
  guardarEnStorage(CLAVE_SESION, { id: usuario.id });
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

/* ============================================================================
   REINICIAR (vuelve todo a los datos iniciales)
   ============================================================================ */
export function reiniciarDatos() {
  localStorage.removeItem(CLAVE_POKEMON);
  localStorage.removeItem(CLAVE_USUARIOS);
  localStorage.removeItem(CLAVE_SESION);
}
