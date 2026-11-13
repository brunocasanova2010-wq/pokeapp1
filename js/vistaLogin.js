/* ============================================================================
   vistaLogin.js  ->  PANTALLA 4:  INICIAR SESIÓN
   ============================================================================ */

import { irA } from "./router.js";
import { iniciarSesion } from "./usuarios.js";
import { mostrarToast, sonar } from "./utilidades.js";

export function dibujarLogin() {
  return `
    <section class="vista" data-vista="login">
      <h1 class="titulo-pantalla">Iniciar sesión</h1>
      <p class="subtitulo">Ingresá con tu usuario para participar de la app.</p>

      <form class="panel-formulario" id="formLogin" novalidate>

        <div class="mensaje-error" id="errorLogin"></div>

        <div class="campo">
          <label for="usuario">Usuario o email</label>
          <input type="text" id="usuario" name="usuario" placeholder="admin" autocomplete="username" />
        </div>

        <div class="campo">
          <label for="password">Contraseña</label>
          <input type="password" id="password" name="password" placeholder="••••••••" autocomplete="current-password" />
        </div>

        <div class="form-acciones">
          <button type="submit" class="btn btn--rojo">Entrar</button>
          <button type="button" class="btn btn--gris" data-ir="registro">Crear cuenta</button>
          <button type="button" class="btn btn--gris" data-ir="inicio">Volver</button>
        </div>

        <div class="nota-sesion">
          <strong>Usuarios de prueba:</strong><br />
          Administrador → usuario <code>admin</code> · contraseña <code>admin123</code><br />
          Usuario común → usuario <code>juan</code> · contraseña <code>juan1234</code>
        </div>
      </form>
    </section>
  `;
}

export function activarLogin() {
  const formulario = document.getElementById("formLogin");
  const cajaError = document.getElementById("errorLogin");

  // El evento "submit" se dispara al tocar Entrar o presionar Enter
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault(); // evitamos que la página se recargue

    // 1) Capturamos los datos del formulario
    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value;

    // 2) Validación simple
    if (usuario === "" || password === "") {
      cajaError.textContent = "Completá el usuario y la contraseña.";
      cajaError.classList.add("visible");
      return;
    }

    // 3) Intentamos iniciar sesión
    const resultado = iniciarSesion(usuario, password);

    if (resultado.ok === false) {
      cajaError.textContent = resultado.mensaje;
      cajaError.classList.add("visible");
      sonar("./assets/sound/error.mp3");
      return;
    }

    // 4) ¡Entró! Le avisamos y lo mandamos al inicio
    sonar("./assets/sound/levelup.mp3");
    mostrarToast("¡Bienvenido, " + resultado.usuario.nombre + "!");
    irA("inicio");
  });

  document.querySelectorAll('[data-vista="login"] [data-ir]').forEach((boton) => {
    boton.addEventListener("click", () => irA(boton.dataset.ir));
  });
}
