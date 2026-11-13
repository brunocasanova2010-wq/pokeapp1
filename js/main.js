/* ============================================================================
   main.js  ->  EL ARCHIVO QUE ARRANCA TODO
   ============================================================================
   1) Importa las vistas (import)
   2) Las registra en el router
   3) Prepara el header (usuario logueado / botón salir)
   4) Activa los eventos globales (menú, navegación, botón atrás)
   5) Dibuja la primera pantalla
   ============================================================================ */

/* ---------------- 1) IMPORTAMOS ---------------- */
import { irA, registrarVista, configurarAlCambiarVista, rutaActual, existeVista } from "./router.js";
import { usuarioActual, cerrarSesion, esAdmin } from "./usuarios.js";
import { mostrarToast, escaparHTML, sonar } from "./utilidades.js";

import { dibujarInicio, activarInicio } from "./vistaInicio.js";
import { dibujarPokedex, activarPokedex } from "./vistaPokedex.js";
import { dibujarDetalle, activarDetalle } from "./vistaDetalle.js";
import { dibujarLogin, activarLogin } from "./vistaLogin.js";
import { dibujarRegistro, activarRegistro } from "./vistaRegistro.js";
import { dibujarCarga, activarCarga } from "./vistaCarga.js";
import { dibujarBatalla, activarBatalla } from "./vistaBatalla.js";

/* ---------------- 2) REGISTRAMOS LAS VISTAS ---------------- */
registrarVista("inicio", dibujarInicio);
registrarVista("pokedex", dibujarPokedex);
registrarVista("detalle", dibujarDetalle);
registrarVista("login", dibujarLogin);
registrarVista("registro", dibujarRegistro);
registrarVista("carga", dibujarCarga);
registrarVista("batalla", dibujarBatalla);

/* ============================================================================
   3) HEADER: zona de usuario + enlaces que cambian según los permisos
   ============================================================================ */
function actualizarHeader() {
  const zona = document.getElementById("zonaUsuario");
  const usuario = usuarioActual();

  // Enlace de "Cargar Pokémon" sólo para admin
  const enlaceCarga = document.querySelector('.solo-admin');
  if (enlaceCarga) {
    enlaceCarga.hidden = !esAdmin();
  }

  // Si no hay usuario: mostramos botones de entrar / registrarse
  if (usuario === null) {
    zona.innerHTML = `
      <button class="btn btn--amarillo btn--chico" data-header="login">Entrar</button>
    `;
    zona.querySelector("[data-header]").addEventListener("click", () => irA("login"));
    return;
  }

  // Si hay usuario: avatar + nombre + botón salir
  const insignia = usuario.admin ? ' <span title="Administrador">👑</span>' : "";

  zona.innerHTML = `
    <img src="${escaparHTML(usuario.avatar)}" alt="Avatar" />
    <span>${escaparHTML(usuario.nombre)}${insignia}</span>
    <button class="btn btn--fantasma btn--chico" id="btnSalir">Salir</button>
  `;

  document.getElementById("btnSalir").addEventListener("click", () => {
    cerrarSesion();
    mostrarToast("Sesión cerrada. ¡Hasta la próxima!");
    irA("inicio");
  });
}

/* ============================================================================
   4) EVENTOS GLOBALES
   ============================================================================ */
function activarNavegacion() {
  // ---- Enlaces del menú de arriba (usan addEventListener) ----
  document.querySelectorAll(".header__nav a").forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
      evento.preventDefault();
      sonar("./assets/sound/click.mp3");

      const destino = enlace.dataset.ir;
      window.location.hash = destino; // para el botón atrás del navegador
      irA(destino);

      // En mobile cerramos el menú
      document.getElementById("navPrincipal").classList.remove("abierto");
    });
  });

  // ---- Logo: vuelve al inicio ----
  document.querySelector(".header__logo").addEventListener("click", (evento) => {
    evento.preventDefault();
    window.location.hash = "inicio";
    irA("inicio");
  });

  // ---- Botón de menú en pantallas chicas ----
  document.getElementById("btnMenu").addEventListener("click", () => {
    document.getElementById("navPrincipal").classList.toggle("abierto");
  });

  // ---- Botón atrás / adelante del navegador ----
  window.addEventListener("hashchange", () => {
    const ruta = rutaActual();

    if (ruta === "detalle") {
      irA("pokedex");
    } else if (existeVista(ruta)) {
      irA(ruta);
    }
  });
}

/* ============================================================================
   ACTIVAR LOS EVENTOS DE CADA VISTA
   Se ejecuta cada vez que el router cambia de pantalla
   ============================================================================ */
function activarVistaActual(nombre, parametro) {
  // 1) Marcamos en el menú cuál es la sección activa
  document.querySelectorAll(".header__nav a").forEach((enlace) => {
    enlace.classList.toggle("activo", enlace.dataset.ir === nombre);
  });

  // 2) Cerramos el menú mobile
  document.getElementById("navPrincipal").classList.remove("abierto");

  // 3) Actualizamos el header (usuario, botón salir, admin)
  actualizarHeader();

  // 4) Activamos los eventos propios de la vista
  if (nombre === "inicio") activarInicio();
  if (nombre === "pokedex") activarPokedex();
  if (nombre === "detalle") activarDetalle(parametro);
  if (nombre === "login") activarLogin();
  if (nombre === "registro") activarRegistro();
  if (nombre === "carga") activarCarga();
  if (nombre === "batalla") activarBatalla();
}

/* ============================================================================
   5) ARRANCAR LA APLICACIÓN
   ============================================================================ */
function iniciar() {
  configurarAlCambiarVista(activarVistaActual);
  activarNavegacion();

  // Si la URL ya trae #pokedex (por ejemplo al recargar), respetamos eso
  const ruta = rutaActual();

  if (ruta === "detalle") {
    irA("pokedex");
  } else if (existeVista(ruta)) {
    irA(ruta);
  } else {
    irA("inicio");
  }

  // Sonido de apertura (el navegador puede bloquearlo hasta el primer click)
  document.addEventListener(
    "click",
    () => sonar("./assets/sound/opening.mp3"),
    { once: true }
  );

  console.log("%cPokeApp cargada ✅", "color:#e3350d;font-weight:bold");
}

/* El DOM ya está listo cuando un módulo se ejecuta */
iniciar();
