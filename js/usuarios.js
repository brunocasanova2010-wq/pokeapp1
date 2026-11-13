/* ============================================================================
   usuarios.js  ->  LÓGICA DE USUARIOS
   ============================================================================
   Funciones:
     · registrarUsuario()  -> crea un usuario nuevo
     · iniciarSesion()     -> valida usuario y contraseña
     · cerrarSesion()      -> olvida al usuario
     · usuarioActual()     -> devuelve el usuario que está logueado
     · esAdmin()           -> true si el usuario logueado es administrador
   ============================================================================ */

import {
  obtenerUsuarios,
  guardarUsuarios,
  proximoIdUsuario,
  obtenerSesion,
  guardarSesion,
  borrarSesion
} from "./almacenamiento.js";

/* ----------------------------------------------------------------------------
   REGISTRAR UN USUARIO NUEVO
   Recibe un objeto con los datos del formulario.
   Devuelve { ok: true, usuario } o { ok: false, mensaje }
   ---------------------------------------------------------------------------- */
export function registrarUsuario(datos) {
  const usuarios = obtenerUsuarios();

  // 1) Validamos que el usuario o el email no estén repetidos
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].username.toLowerCase() === datos.username.toLowerCase()) {
      return { ok: false, mensaje: "Ese nombre de usuario ya está en uso." };
    }
    if (usuarios[i].email.toLowerCase() === datos.email.toLowerCase()) {
      return { ok: false, mensaje: "Ese email ya está registrado." };
    }
  }

  // 2) Construimos el objeto usuario con la estructura de la consigna
  const usuarioNuevo = {
    id: proximoIdUsuario(),
    nombre: datos.nombre,
    email: datos.email,
    username: datos.username,
    password: datos.password,
    avatar: datos.avatar,
    admin: false // los registrados por la web son usuarios comunes
  };

  // 3) Lo agregamos a la lista y guardamos
  usuarios.push(usuarioNuevo);
  guardarUsuarios(usuarios);

  return { ok: true, usuario: usuarioNuevo };
}

/* ----------------------------------------------------------------------------
   INICIAR SESIÓN
   Compara el username y la password contra la lista de usuarios
   ---------------------------------------------------------------------------- */
export function iniciarSesion(username, password) {
  const usuarios = obtenerUsuarios();

  for (let i = 0; i < usuarios.length; i++) {
    const usuario = usuarios[i];

    const coincideUsuario =
      usuario.username.toLowerCase() === username.toLowerCase() ||
      usuario.email.toLowerCase() === username.toLowerCase();

    if (coincideUsuario && usuario.password === password) {
      guardarSesion(usuario); // recordamos quién entró
      return { ok: true, usuario: usuario };
    }
  }

  return { ok: false, mensaje: "Usuario o contraseña incorrectos." };
}

/* ----------------------------------------------------------------------------
   CERRAR SESIÓN
   ---------------------------------------------------------------------------- */
export function cerrarSesion() {
  borrarSesion();
}

/* ----------------------------------------------------------------------------
   USUARIO ACTUAL
   Toma el id guardado en la sesión y busca el objeto completo del usuario.
   Devuelve null si nadie inició sesión.
   ---------------------------------------------------------------------------- */
export function usuarioActual() {
  const sesion = obtenerSesion();
  if (sesion === null) return null;

  const usuarios = obtenerUsuarios();

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id === sesion.id) {
      return usuarios[i];
    }
  }

  // El usuario ya no existe: limpiamos la sesión
  borrarSesion();
  return null;
}

/* ----------------------------------------------------------------------------
   ¿ES ADMINISTRADOR?
   ---------------------------------------------------------------------------- */
export function esAdmin() {
  const usuario = usuarioActual();
  return usuario !== null && usuario.admin === true;
}
