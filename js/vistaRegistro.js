/* ============================================================================
   vistaRegistro.js  ->  PANTALLA 5:  REGISTRARSE
   ============================================================================ */

import { irA } from "./router.js";
import { registrarUsuario } from "./usuarios.js";
import { mostrarToast, sonar, escaparHTML } from "./utilidades.js";

/* Avatares disponibles */
const avatares = [
  "./assets/avatar/a1.png",
  "./assets/avatar/a2.png",
  "./assets/avatar/a3.png"
];

export function dibujarRegistro() {
  // Armamos las opciones de avatar recorriendo el array
  let opcionesAvatar = "";

  for (let i = 0; i < avatares.length; i++) {
    opcionesAvatar += `
      <label class="avatar-opcion">
        <input type="radio" name="avatar" value="${avatares[i]}" ${i === 0 ? "checked" : ""} />
        <img src="${avatares[i]}" alt="Avatar ${i + 1}" />
      </label>
    `;
  }

  return `
    <section class="vista" data-vista="registro">
      <h1 class="titulo-pantalla">Crear cuenta</h1>
      <p class="subtitulo">Completá tus datos para poder iniciar sesión.</p>

      <form class="panel-formulario" id="formRegistro" novalidate>

        <div class="mensaje-error" id="errorRegistro"></div>

        <div class="campo">
          <label for="nombre">Nombre y apellido</label>
          <input type="text" id="nombre" placeholder="Juan Pérez" />
        </div>

        <div class="campo">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="juan@example.com" />
        </div>

        <div class="fila">
          <div class="campo">
            <label for="username">Nombre de usuario</label>
            <input type="text" id="username" placeholder="juan123" />
          </div>

          <div class="campo">
            <label for="passwordRegistro">Contraseña</label>
            <input type="password" id="passwordRegistro" placeholder="mínimo 6 caracteres" />
          </div>
        </div>

        <div class="campo">
          <label>Elegí tu avatar</label>
          <div class="avatares">${opcionesAvatar}</div>
        </div>

        <div class="form-acciones">
          <button type="submit" class="btn btn--rojo">Registrarme</button>
          <button type="button" class="btn btn--gris" data-ir="login">Ya tengo cuenta</button>
          <button type="button" class="btn btn--gris" data-ir="inicio">Volver</button>
        </div>
      </form>
    </section>
  `;
}

export function activarRegistro() {
  const formulario = document.getElementById("formRegistro");
  const cajaError = document.getElementById("errorRegistro");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    // 1) Capturamos los datos de los inputs
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("passwordRegistro").value;

    // 2) Elegimos el avatar marcado (radio)
    const avatarMarcado = document.querySelector('input[name="avatar"]:checked');
    const avatar = avatarMarcado ? avatarMarcado.value : avatares[0];

    // 3) Validaciones
    const mensaje = validar(nombre, email, username, password);

    if (mensaje !== "") {
      cajaError.textContent = mensaje;
      cajaError.classList.add("visible");
      sonar("./assets/sound/error.mp3");
      return;
    }

    // 4) Creamos el usuario
    const resultado = registrarUsuario({ nombre, email, username, password, avatar });

    if (resultado.ok === false) {
      cajaError.textContent = resultado.mensaje;
      cajaError.classList.add("visible");
      sonar("./assets/sound/error.mp3");
      return;
    }

    // 5) Todo bien: avisamos y mandamos al login
    sonar("./assets/sound/levelup.mp3");
    mostrarToast("¡Cuenta creada! Ahora iniciá sesión.");
    irA("login");
  });

  document.querySelectorAll('[data-vista="registro"] [data-ir]').forEach((boton) => {
    boton.addEventListener("click", () => irA(boton.dataset.ir));
  });
}

/* ----------------------------------------------------------------------------
   VALIDACIONES DEL REGISTRO
   Devuelve un texto de error o "" si está todo bien
   ---------------------------------------------------------------------------- */
function validar(nombre, email, username, password) {
  if (nombre.length < 3) return "Escribí tu nombre completo (mínimo 3 letras).";

  if (!email.includes("@") || !email.includes(".")) return "El email no parece válido.";

  if (username.length < 3) return "El nombre de usuario debe tener al menos 3 caracteres.";

  if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";

  return "";
}
