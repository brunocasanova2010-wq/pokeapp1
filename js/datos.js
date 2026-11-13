/* ============================================================================
   datos.js  ->  LOS DATOS INICIALES DE LA APLICACIÓN
   ============================================================================
   Acá guardamos:
     · el array con los Pokémon iniciales
     · el array con los usuarios iniciales (uno es administrador)

   Cada Pokémon es un OBJETO con los campos que pide la consigna.
   Cada usuario también es un OBJETO con los campos que pide la consigna.
   ============================================================================ */

/* ----------------------------------------------------------------------------
   USUARIOS INICIALES
   - admin: true  -> es administrador, puede cargar Pokémon
   - admin: false -> es un usuario común
   ---------------------------------------------------------------------------- */
export const usuariosIniciales = [
  {
    id: 1,
    nombre: "Prof. Argumedo",
    email: "admin@pokeapp.com",
    username: "admin",
    password: "admin123",
    avatar: "./assets/avatar/a1.png",
    admin: true
  },
  {
    id: 2,
    nombre: "Juan",
    email: "juan@example.com",
    username: "juan",
    password: "juan1234",
    avatar: "./assets/avatar/a2.png",
    admin: false
  },
  {
    id: 3,
    nombre: "Sofía",
    email: "sofia@example.com",
    username: "sofia",
    password: "sofia1234",
    avatar: "./assets/avatar/a3.png",
    admin: false
  }
];

/* ----------------------------------------------------------------------------
   POKÉMON INICIALES
   Cada objeto tiene TODOS los campos obligatorios de la consigna:
   id, nombre, tipo, descripcion, altura, peso, generacion, hp, ataque,
   velocidad, defensa, habilidad, tieneEvolucion, evolucion, nivelEvolucion,
   rareza, imagen, sonido, shiny, imagenShiny
   ---------------------------------------------------------------------------- */
export const pokemonIniciales = [
  {
    id: 1,
    nombre: "Bulbasaur",
    tipo: ["Planta", "Veneno"],
    descripcion:
      "Bulbasaur es un Pokémon de tipo Planta y Veneno. Es conocido por la semilla que lleva en su espalda, la cual crece a medida que evoluciona.",
    altura: 0.7,
    peso: 6.9,
    generacion: 1,
    hp: 45,
    ataque: 49,
    velocidad: 45,
    defensa: 49,
    habilidad: "Espesura",
    tieneEvolucion: true,
    evolucion: "Ivysaur",
    nivelEvolucion: 16,
    rareza: "Común",
    imagen: "./assets/img/p1.png",
    sonido: "./assets/sound/bulbasaur.mp3",
    shiny: true,
    imagenShiny: "./assets/img/p1-shiny.png"
  },
  {
    id: 4,
    nombre: "Charmander",
    tipo: ["Fuego"],
    descripcion:
      "Charmander es un Pokémon de tipo Fuego. La llama que tiene en la punta de la cola indica su estado de ánimo: arde más fuerte cuando está contento.",
    altura: 0.6,
    peso: 8.5,
    generacion: 1,
    hp: 39,
    ataque: 52,
    velocidad: 65,
    defensa: 43,
    habilidad: "Mar Llamas",
    tieneEvolucion: true,
    evolucion: "Charmeleon",
    nivelEvolucion: 16,
    rareza: "Común",
    imagen: "./assets/img/p4.png",
    sonido: "./assets/sound/charmander.mp3",
    shiny: true,
    imagenShiny: "./assets/img/p4-shiny.png"
  },
  {
    id: 7,
    nombre: "Squirtle",
    tipo: ["Agua"],
    descripcion:
      "Squirtle es un Pokémon de tipo Agua. Su caparazón lo protege y, cuando se siente amenazado, dispara agua a presión por la boca.",
    altura: 0.5,
    peso: 9.0,
    generacion: 1,
    hp: 44,
    ataque: 48,
    velocidad: 43,
    defensa: 65,
    habilidad: "Torrente",
    tieneEvolucion: true,
    evolucion: "Wartortle",
    nivelEvolucion: 16,
    rareza: "Común",
    imagen: "./assets/img/p7.png",
    sonido: "./assets/sound/squirtle.mp3",
    shiny: true,
    imagenShiny: "./assets/img/p7-shiny.png"
  },
  {
    id: 25,
    nombre: "Pikachu",
    tipo: ["Eléctrico"],
    descripcion:
      "Pikachu es un Pokémon de tipo Eléctrico. Acumula electricidad en las bolsas de sus mejillas y puede liberarla cuando se siente en peligro.",
    altura: 0.4,
    peso: 6.0,
    generacion: 1,
    hp: 35,
    ataque: 55,
    velocidad: 90,
    defensa: 40,
    habilidad: "Electricidad Estática",
    tieneEvolucion: true,
    evolucion: "Raichu",
    nivelEvolucion: 22,
    rareza: "Raro",
    imagen: "./assets/img/p25.png",
    sonido: "./assets/sound/pikachu.mp3",
    shiny: true,
    imagenShiny: "./assets/img/p25-shiny.png"
  },
  {
    id: 39,
    nombre: "Jigglypuff",
    tipo: ["Normal", "Hada"],
    descripcion:
      "Jigglypuff es un Pokémon de tipo Normal y Hada. Su canción de cuna hace dormir a quien la escucha, y después dibuja en su cara con el micrófono.",
    altura: 0.5,
    peso: 5.5,
    generacion: 1,
    hp: 115,
    ataque: 45,
    velocidad: 20,
    defensa: 20,
    habilidad: "Gran Encanto",
    tieneEvolucion: true,
    evolucion: "Wigglytuff",
    nivelEvolucion: 30,
    rareza: "Común",
    imagen: "./assets/img/p39.png",
    sonido: "./assets/sound/jigglypuff.mp3",
    shiny: false,
    imagenShiny: "./assets/img/p39-shiny.png"
  },
  {
    id: 52,
    nombre: "Meowth",
    tipo: ["Normal"],
    descripcion:
      "Meowth es un Pokémon de tipo Normal. Le encantan las monedas brillantes y suele buscar tesoros en los callejones de las ciudades.",
    altura: 0.4,
    peso: 4.2,
    generacion: 1,
    hp: 40,
    ataque: 45,
    velocidad: 90,
    defensa: 35,
    habilidad: "Recogida",
    tieneEvolucion: true,
    evolucion: "Persian",
    nivelEvolucion: 28,
    rareza: "Común",
    imagen: "./assets/img/p52.png",
    sonido: "./assets/sound/meowth.mp3",
    shiny: true,
    imagenShiny: "./assets/img/p52-shiny.png"
  },
  {
    id: 94,
    nombre: "Gengar",
    tipo: ["Fantasma", "Veneno"],
    descripcion:
      "Gengar es un Pokémon de tipo Fantasma y Veneno. Se esconde en las sombras y desaparece cuando alguien lo mira fijamente.",
    altura: 1.5,
    peso: 40.5,
    generacion: 1,
    hp: 60,
    ataque: 65,
    velocidad: 110,
    defensa: 60,
    habilidad: "Levitación",
    tieneEvolucion: false,
    evolucion: "No evoluciona",
    nivelEvolucion: 0,
    rareza: "Épico",
    imagen: "./assets/img/p94.png",
    sonido: "./assets/sound/gengar.mp3",
    shiny: true,
    imagenShiny: "./assets/img/p94-shiny.png"
  },
  {
    id: 133,
    nombre: "Eevee",
    tipo: ["Normal"],
    descripcion:
      "Eevee es un Pokémon de tipo Normal. Su código genético es inestable, por eso puede evolucionar a distintas formas según el entorno.",
    altura: 0.3,
    peso: 6.5,
    generacion: 1,
    hp: 55,
    ataque: 55,
    velocidad: 55,
    defensa: 50,
    habilidad: "Fuga",
    tieneEvolucion: true,
    evolucion: "Vaporeon / Jolteon / Flareon",
    nivelEvolucion: 25,
    rareza: "Raro",
    imagen: "./assets/img/p133.png",
    sonido: "./assets/sound/eevee.mp3",
    shiny: true,
    imagenShiny: "./assets/img/p133-shiny.png"
  }
];
