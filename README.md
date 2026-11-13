# PokeApp · Pokédex interactiva

Trabajo Práctico 9 — **Funcionamiento de los Sistemas Digitales** (Prof. Roberto Argumedo)
Hecho con **HTML5 + CSS3 + JavaScript** puro (sin frameworks ni librerías).

## Cómo abrirla

1. Descargá la carpeta completa.
2. Abrí `index.html` con doble click, o mejor: usá **Live Server** en VS Code
   (clic derecho sobre `index.html` → *Open with Live Server*).
   > Con `file://` algunos navegadores bloquean los módulos `import`. Si la página
   > queda en blanco, abrila con Live Server o subila a GitHub Pages.

## Usuarios de prueba

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| Administrador | `admin` | `admin123` |
| Usuario común | `juan` | `juan1234` |

## Pantallas

1. **Inicio** (`vistaInicio.js`)
2. **Pokédex** con buscador y filtros (`vistaPokedex.js`)
3. **Detalle de Pokémon** (`vistaDetalle.js`)
4. **Iniciar sesión** (`vistaLogin.js`)
5. **Registrarse** (`vistaRegistro.js`)
6. **Carga de Pokémon** (solo admin) (`vistaCarga.js`)
7. **Batalla por decisiones** (`vistaBatalla.js` + `guionBatalla.js`)

## Estructura de carpetas

```
pokeapp/
├── index.html              ← contenedor principal (<main id="app">)
├── css/
│   └── styles.css          ← todos los estilos
├── js/
│   ├── main.js             ← arranca todo y conecta los eventos
│   ├── router.js           ← cambio de vistas por JavaScript
│   ├── datos.js            ← Pokémon y usuarios iniciales (objetos y arrays)
│   ├── almacenamiento.js   ← JSON + localStorage
│   ├── usuarios.js         ← registro, login, permisos
│   ├── utilidades.js       ← ayudantes (toast, sonido, formatos)
│   ├── vistaInicio.js
│   ├── vistaPokedex.js
│   ├── vistaDetalle.js
│   ├── vistaLogin.js
│   ├── vistaRegistro.js
│   ├── vistaCarga.js
│   ├── vistaBatalla.js
│   └── guionBatalla.js     ← situaciones, textos y efectos de la pelea
├── assets/
│   ├── img/                ← sprites de los Pokémon
│   ├── avatar/             ← avatares de usuario
│   └── sound/              ← gritos y efectos de sonido
└── docs/
    ├── README.md           ← este archivo
    └── explicacion.md      ← cómo se conecta todo (para la presentación)
```
