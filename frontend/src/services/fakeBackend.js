
/* ========== ENTRADAS ========== */
const entradas = [
  {
    id: 1,
    nombre: "ABONO GENERAL",
    precio: "72,50€",
    descripcion: "Acceso a todos los escenarios durante los 3 días del festival.",
    etiqueta: "MÁS VENDIDO",
    tipoEtiqueta: "popular",
    estado: "disponible",
    img: "/imgsTickets/ticketNormal.jpg"
  },
  {
    id: 2,
    nombre: "ABONO VIP",
    precio: "155€",
    descripcion: "Zona VIP exclusiva, acceso prioritario y barra privada.",
    etiqueta: "MUY LIMITADO",
    tipoEtiqueta: "limitado",
    estado: "disponible",
    img: "/imgsTickets/ticketVIP.jpg"
  },
  {
    id: 3,
    nombre: "DREAM VIP",
    precio: "300€",
    descripcion: "Experiencia premium completa, backstage y catering exclusivo.",
    etiqueta: "NOVEDAD",
    tipoEtiqueta: "nuevo",
    estado: "agotado",
    img: "/imgsTickets/ticketDreamVIP.jpg"
  }
];

/* Esto simula una latencia real de red, despuesd de los 300ms, devuelve los datos */
export function getEntradas() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(entradas);
    }, 300);
  });
}

/* ========== ARTISTAS ========== */

const artistas = [
  { id: 1, nombre: "Bad Bunny", dia: "Viernes 17 Julio", img: "/artists/badbunny.avif", spoty: "https://open.spotify.com/intl-es/artist/4q3ewBCX7sLwd24euuV69X?si=GDxQaWljSByaLIgaaX6ZLQ" },
  { id: 2, nombre: "Rosalía", dia: "Viernes 17 Julio", img: "/artists/rosalia.jpg", spoty: "https://open.spotify.com/intl-es/artist/7ltDVBr6mKbRvohxheJ9h1?si=iPFZ1DvBQ_a7tsBgrCBb0Q" },
  { id: 3, nombre: "Martín Garrix", dia: "Viernes 17 Julio", img: "/artists/martingarrix.jpg", spoty: "https://open.spotify.com/intl-es/artist/60d24wfXkVzDSfLS6hyCjZ?si=MlrquFQVRO--Ef9AU3oVQg" },
  { id: 4, nombre: "Quevedo", dia: "Viernes 17 Julio", img: "/artists/quevedo.jpg", spoty: "https://open.spotify.com/intl-es/artist/52iwsT98xCoGgiGntTiR7K?si=2cVTrqxVRTqMP3qxo1jfOw" },
  { id: 5, nombre: "Bizarrap", dia: "Viernes 17 Julio", img: "/artists/biza.webp", spoty: "https://open.spotify.com/intl-es/artist/716NhGYqD1jl2wI1Qkgq36?si=Nu8EpR_UT6qdatN8lmAB7g" },
  { id: 6, nombre: "Charlotte de Witte", dia: "Viernes 17 Julio", img: "/artists/charlotte.jpg", spoty: "https://open.spotify.com/intl-es/artist/1lJhME1ZpzsEa5M0wW6Mso?si=PRL2DUvaTmObKo2qj058Ew" },
  { id: 7, nombre: "Saiko", dia: "Viernes 17 Julio", img: "/artists/saiko.jpg", spoty: "https://open.spotify.com/intl-es/artist/2O8vbr4RYPpk6MRA4fio7u?si=LRO9CTEqSd2bkVC7rrcQVA" },
  { id: 9, nombre: "Trueno", dia: "Viernes 17 Julio", img: "/artists/trueno.jpg", spoty: "https://open.spotify.com/intl-es/artist/2x7PC78TmgqpEIjaGAZ0Oz?si=g4xC2V2sTtqxZPij2k5kSQ" },
  { id: 10, nombre: "Anuel AA", dia: "Viernes 17 Julio", img: "/artists/anuel.jpg", spoty: "https://open.spotify.com/search/Anuel%20AA" },
  { id: 11, nombre: "Amelie Lens", dia: "Viernes 17 Julio", img: "/artists/amelielens.webp", spoty: "https://open.spotify.com/search/Amelie%20Lens" },
  { id: 12, nombre: "Mora", dia: "Viernes 17 Julio", img: "/artists/mora.jpg", spoty: "https://open.spotify.com/search/Mora" },
  { id: 13, nombre: "Don Diablo", dia: "Viernes 17 Julio", img: "/artists/dondiablo.jpg", spoty: "https://open.spotify.com/search/Don%20Diablo" },
  { id: 14, nombre: "Vintage Culture", dia: "Viernes 17 Julio", img: "/artists/vintage.jpg", spoty: "https://open.spotify.com/search/Vintage%20Culture" },

  { id: 15, nombre: "Feid", dia: "Sábado 18 Julio", img: "/artists/feid.webp", spoty: "https://open.spotify.com/search/Feid" },
  { id: 16, nombre: "David Guetta", dia: "Sábado 18 Julio", img: "/artists/davidguetta.jpeg", spoty: "https://open.spotify.com/search/David%20Guetta" },
  { id: 17, nombre: "Karol G", dia: "Sábado 18 Julio", img: "/artists/karolg.jpg", spoty: "https://open.spotify.com/search/Karol%20G" },
  { id: 18, nombre: "Myke Towers", dia: "Sábado 18 Julio", img: "/artists/myketowers.webp", spoty: "https://open.spotify.com/search/Myke%20Towers" },
  { id: 19, nombre: "Carl Cox", dia: "Sábado 18 Julio", img: "/artists/carlcox.jpg", spoty: "https://open.spotify.com/search/Carl%20Cox" },
  { id: 21, nombre: "Tale Of Us", dia: "Sábado 18 Julio", img: "/artists/tale.jpg", spoty: "https://open.spotify.com/search/Tale%20Of%20Us" },
  { id: 22, nombre: "Dellafuente", dia: "Sábado 18 Julio", img: "/artists/dellafuente.avif", spoty: "https://open.spotify.com/search/Dellafuente" },
  { id: 23, nombre: "Peggy Gou", dia: "Sábado 18 Julio", img: "/artists/peggy.webp", spoty: "https://open.spotify.com/search/Peggy%20Gou" },
  { id: 25, nombre: "Anyma", dia: "Sábado 18 Julio", img: "/artists/anyma.png", spoty: "https://open.spotify.com/search/Anyma" },
  { id: 26, nombre: "Marco Trujillo", dia: "Sábado 18 Julio", img: "/artists/trujillo.webp", spoty: "https://open.spotify.com/search/Marco%20Trujillo" },
  { id: 27, nombre: "Aidan DJ", dia: "Sábado 18 Julio", img: "/artists/aidan.webp", spoty: "https://open.spotify.com/search/Aidan%20DJ" },

  { id: 28, nombre: "J Balvin", dia: "Domingo 19 Julio", img: "/artists/jbalvin.jpg", spoty: "https://open.spotify.com/search/J%20Balvin" },
  { id: 30, nombre: "Rauw Alejandro", dia: "Domingo 19 Julio", img: "/artists/rauw.webp", spoty: "https://open.spotify.com/search/Rauw%20Alejandro" },
  { id: 32, nombre: "Eladio Carrión", dia: "Domingo 19 Julio", img: "/artists/eladio.jpeg", spoty: "https://open.spotify.com/search/Eladio%20Carrión" },
  { id: 33, nombre: "Steve Aoki", dia: "Domingo 19 Julio", img: "/artists/aoki.jpg", spoty: "https://open.spotify.com/search/Steve%20Aoki" },
  { id: 34, nombre: "Central Cee", dia: "Domingo 19 Julio", img: "/artists/centralcee.jpg", spoty: "https://open.spotify.com/search/Central%20Cee" },
  { id: 35, nombre: "Bad Gyal", dia: "Domingo 19 Julio", img: "/artists/badgyal.webp", spoty: "https://open.spotify.com/search/Bad%20Gyal" },
  { id: 37, nombre: "Duki", dia: "Domingo 19 Julio", img: "/artists/duki.jpg", spoty: "https://open.spotify.com/search/Duki" },
  { id: 38, nombre: "Solomun", dia: "Domingo 19 Julio", img: "/artists/solomun.jpg", spoty: "https://open.spotify.com/search/Solomun" },
  { id: 39, nombre: "Alesso", dia: "Domingo 19 Julio", img: "/artists/alesso.jpg", spoty: "https://open.spotify.com/search/Alesso" }
];

export function getArtistas() {
  return Promise.resolve(artistas);
}

const faqsUsuarios = [
  { q: "¿Cómo compro entradas?", a: "Desde la sección Entradas puedes seleccionar el abono y completar la compra." },
  { q: "¿Puedo devolver mi entrada?", a: "Consulta las condiciones en Política y Privacidad." },
  { q: "¿Hay restricciones de edad?", a: "Depende de la normativa del evento. Revisa la sección Info." },
  { q: "¿Qué puedo llevar al festival?", a: "Consulta la lista de objetos permitidos en Preguntas Frecuentes." },
  { q: "¿Dónde se celebra y cómo llego?", a: "La ubicación y accesos están en la sección Info/Mapa." },
  { q: "¿Qué pasa si llueve?", a: "El festival se celebra salvo condiciones extremas. Sigue comunicaciones oficiales." },
  { q: "¿Puedo devolver mi entrada?", a: "Las entradas pueden cancelarse según las condiciones indicadas en Política y Privacidad." }
];

const faqsProveedores = [
  { q: "¿Cómo me registro como proveedor?", a: "En Registro elige Proveedor y añade la descripción del servicio." },
  { q: "¿Cómo solicito un espacio?", a: "Desde Proveedores podrás iniciar el proceso de solicitud." },
  { q: "¿Qué tipos de proveedor se aceptan?", a: "Foodtruck, merchandising, servicios técnicos, etc." },
  { q: "¿Cómo se valida mi solicitud?", a: "El equipo revisa tu propuesta y contacta contigo." },
  { q: "¿Hay cuota o comisión?", a: "Depende del tipo de servicio. Se especifica en las condiciones de proveedores." },
  { q: "¿Qué documentación necesito?", a: "Licencias, seguro, certificados sanitarios (si aplica) y datos fiscales." }
];

export function getFaqsUsuarios() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(faqsUsuarios);
    }, 300);
  });
}

export function getFaqsProveedores() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(faqsProveedores);
    }, 300);
  });
}

const espaciosContratados = [
  {
    id: 1,
    nombre: "Food Court Principal",
    tipo: "Bebidas",
    evento: "Subsonic Festival 2026",
    lugar: "Zona Norte - Entrada Principal",
    tamano: "500m²",
    precio: "2.500€",
    ubicacion: "Ubicación 1",
    descripcion: "Espacio premium en zona de máximo tránsito",
    servicios: [
      {
        id: 1001,
        espacioId: 1,
        nombre: "Barra Fusión",
        tipo: "Bebidas",
        descripcion: "Servicio de cócteles y bebidas sin alcohol durante todo el festival.",
        fechas: "17-20 julio"
      }
    ]
  },
  {
    id: 2,
    nombre: "Zona Merch Norte",
    tipo: "General",
    evento: "Subsonic Festival 2026",
    lugar: "Acceso norte - lateral merchandising",
    tamano: "220m²",
    precio: "1.900€",
    ubicacion: "Ubicación 2",
    descripcion: "Espacio comercial ideal para marcas y productos oficiales",
    servicios: []
  }
];

const serviciosProveedor = [
  {
    id: 1001,
    espacioId: 1,
    nombre: "Barra Fusión",
    tipo: "Bebidas",
    descripcion: "Servicio de cócteles y bebidas sin alcohol durante todo el festival.",
    fechas: "17-20 julio"
  }
];

const espaciosDisponibles = [
  {
    id: 1,
    nombre: "Zona Velar",
    zonaGeneral: "Norte",
    caracteristica: "Terreno llano cubierto con carpa",
    evento: "Subsonic Festival 2026",
    lugar: "Acceso principal norte del recinto",
    tamano: "500m²",
    precio: "2.500€",
    descripcion: "Espacio premium en zona de máximo tránsito, con carpa que garantiza protección frente a las condiciones meteorológicas.",
    capacidad: "20 stands",
    servicios: ["Electricidad", "Agua corriente", "Zona de carga/descarga", "Iluminación nocturna"],
    disponibilidad: "Disponible",
    imagen: "/espacios/foodcourt.jpg"
  },
  {
    id: 2,
    nombre: "Zona Paseo Central",
    zonaGeneral: "Centro",
    caracteristica: "Avenida peatonal pavimentada",
    evento: "Subsonic Festival 2026",
    lugar: "Eje central del recinto",
    tamano: "300m²",
    precio: "1.800€",
    descripcion: "Paseo principal de alto tránsito con suelo pavimentado y señalización visual estratégica.",
    capacidad: "15 stands",
    servicios: ["Electricidad", "WiFi", "Seguridad 24h", "Almacén cercano"],
    disponibilidad: "Disponible",
    imagen: "/espacios/merchandising.jpg"
  },
  {
    id: 3,
    nombre: "Zona Relax",
    zonaGeneral: "Este",
    caracteristica: "Terreno ajardinado con sombra natural",
    evento: "Subsonic Festival 2026",
    lugar: "Área verde lateral este",
    tamano: "800m²",
    precio: "3.200€",
    descripcion: "Área verde con árboles y vegetación que proporciona sombra natural, ideal para experiencias al aire libre.",
    capacidad: "10 espacios grandes",
    servicios: ["Electricidad", "Sombra natural", "Zona WiFi", "Asientos incluidos"],
    disponibilidad: "Reservado",
    imagen: "/espacios/chillout.jpg"
  },
  {
    id: 4,
    nombre: "Zona VIP",
    zonaGeneral: "Centro",
    caracteristica: "Recinto cerrado con acceso controlado",
    evento: "Subsonic Festival 2026",
    lugar: "Zona exclusiva central del recinto",
    tamano: "150m²",
    precio: "4.500€",
    descripcion: "Espacio exclusivo vallado con acceso restringido por pulsera, ambiente premium y atención personalizada.",
    capacidad: "5 barras",
    servicios: ["Electricidad", "Agua", "Cámaras frigoríficas", "Sistema de sonido", "Iluminación especial"],
    disponibilidad: "Disponible",
    imagen: "/espacios/vipbar.jpg"
  },
  {
    id: 5,
    nombre: "Zona Innova",
    zonaGeneral: "Sur",
    caracteristica: "Pabellón cubierto climatizado",
    evento: "Subsonic Festival 2026",
    lugar: "Pabellón sur - Área Innovación",
    tamano: "600m²",
    precio: "2.800€",
    descripcion: "Pabellón cerrado con climatización, perfecto para instalaciones tecnológicas y activaciones de alto impacto.",
    capacidad: "8 stands grandes",
    servicios: ["Electricidad de alta potencia", "WiFi fibra óptica", "Climatización", "Proyectores"],
    disponibilidad: "Disponible",
    imagen: "/espacios/gaming.jpg"
  },
  {
    id: 6,
    nombre: "Zona Oeste",
    zonaGeneral: "Oeste",
    caracteristica: "Callejón urbano con suelo de adoquín",
    evento: "Subsonic Festival 2026",
    lugar: "Lateral oeste del recinto",
    tamano: "400m²",
    precio: "2.000€",
    descripcion: "Callejón con estética urbana, suelo de adoquín y alto flujo de asistentes procedentes del escenario principal.",
    capacidad: "12 food trucks",
    servicios: ["Electricidad", "Agua", "Sistema de extracción", "Zona de comensales"],
    disponibilidad: "Disponible",
    imagen: "/espacios/streetfood.jpg"
  },
  {
    id: 7,
    nombre: "Zona Boutique",
    zonaGeneral: "Norte",
    caracteristica: "Espacio acotado con iluminación especial",
    evento: "Subsonic Festival 2026",
    lugar: "Entrada secundaria norte",
    tamano: "120m²",
    precio: "1.500€",
    descripcion: "Rincón exclusivo con iluminación cálida y delimitación visual, pensado para marcas de carácter premium.",
    capacidad: "6 stands",
    servicios: ["Electricidad", "Espejos", "Iluminación profesional", "Aire acondicionado"],
    disponibilidad: "Disponible",
    imagen: "/espacios/beauty.jpg"
  },
  {
    id: 8,
    nombre: "Zona Stage",
    zonaGeneral: "Sur",
    caracteristica: "Tarima elevada con gradas laterales",
    evento: "Subsonic Festival 2026",
    lugar: "Extremo sur del recinto",
    tamano: "200m²",
    precio: "5.000€",
    descripcion: "Escenario secundario elevado con gradas a ambos lados, máxima visibilidad desde cualquier ángulo del recinto.",
    capacidad: "1 escenario completo",
    servicios: ["Sistema de sonido completo", "Iluminación profesional", "Backstage", "Generador propio"],
    disponibilidad: "Reservado",
    imagen: "/espacios/stage.jpg"
  }
];

export function getEspaciosContratadosProveedor() {
  return Promise.resolve(espaciosContratados);
}

export function getServiciosProveedor() {
  return Promise.resolve(serviciosProveedor);
}

export function getEspaciosDisponibles() {
  return Promise.resolve(espaciosDisponibles);
}


const espacios = [
  {
    id: 1,
    nombre: "Zona Velar",
    zonaGeneral: "Norte",
    caracteristica: "Terreno llano cubierto con carpa",
    evento: "Subsonic Festival 2026",
    lugar: "Acceso principal norte del recinto",
    tamano: "500m²",
    precio: "2.500€",
    descripcion: "Espacio premium en zona de máximo tránsito, con carpa que garantiza protección frente a las condiciones meteorológicas.",
    capacidad: "20 stands",
    servicios: ["Electricidad", "Agua corriente", "Zona de carga/descarga", "Iluminación nocturna"],
    disponibilidad: "Disponible",
    imagen: "/espacios/foodcourt.jpg"
  },
  {
    id: 2,
    nombre: "Zona Paseo Central",
    zonaGeneral: "Centro",
    caracteristica: "Avenida peatonal pavimentada",
    evento: "Subsonic Festival 2026",
    lugar: "Eje central del recinto",
    tamano: "300m²",
    precio: "1.800€",
    descripcion: "Paseo principal de alto tránsito con suelo pavimentado y señalización visual estratégica.",
    capacidad: "15 stands",
    servicios: ["Electricidad", "WiFi", "Seguridad 24h", "Almacén cercano"],
    disponibilidad: "Disponible",
    imagen: "/espacios/merchandising.jpg"
  },
  {
    id: 3,
    nombre: "Zona Relax",
    zonaGeneral: "Este",
    caracteristica: "Terreno ajardinado con sombra natural",
    evento: "Subsonic Festival 2026",
    lugar: "Área verde lateral este",
    tamano: "800m²",
    precio: "3.200€",
    descripcion: "Área verde con árboles y vegetación que proporciona sombra natural, ideal para experiencias al aire libre.",
    capacidad: "10 espacios grandes",
    servicios: ["Electricidad", "Sombra natural", "Zona WiFi", "Asientos incluidos"],
    disponibilidad: "Reservado",
    negocio: { nombre: "Green Bites", categoria: "Comida" },
    imagen: "/espacios/chillout.jpg"
  },
  {
    id: 4,
    nombre: "Zona VIP",
    zonaGeneral: "Centro",
    caracteristica: "Recinto cerrado con acceso controlado",
    evento: "Subsonic Festival 2026",
    lugar: "Zona exclusiva central del recinto",
    tamano: "150m²",
    precio: "4.500€",
    descripcion: "Espacio exclusivo vallado con acceso restringido por pulsera, ambiente premium y atención personalizada.",
    capacidad: "5 barras",
    servicios: ["Electricidad", "Agua", "Cámaras frigoríficas", "Sistema de sonido", "Iluminación especial"],
    disponibilidad: "Disponible",
    imagen: "/espacios/vipbar.jpg"
  },
  {
    id: 5,
    nombre: "Zona Innova",
    zonaGeneral: "Sur",
    caracteristica: "Pabellón cubierto climatizado",
    evento: "Subsonic Festival 2026",
    lugar: "Pabellón sur - Área Innovación",
    tamano: "600m²",
    precio: "2.800€",
    descripcion: "Pabellón cerrado con climatización, perfecto para instalaciones tecnológicas y activaciones de alto impacto.",
    capacidad: "8 stands grandes",
    servicios: ["Electricidad de alta potencia", "WiFi fibra óptica", "Climatización", "Proyectores"],
    disponibilidad: "Disponible",
    imagen: "/espacios/gaming.jpg"
  },
  {
    id: 6,
    nombre: "Zona Oeste",
    zonaGeneral: "Oeste",
    caracteristica: "Callejón urbano con suelo de adoquín",
    evento: "Subsonic Festival 2026",
    lugar: "Lateral oeste del recinto",
    tamano: "400m²",
    precio: "2.000€",
    descripcion: "Callejón con estética urbana, suelo de adoquín y alto flujo de asistentes procedentes del escenario principal.",
    capacidad: "12 food trucks",
    servicios: ["Electricidad", "Agua", "Sistema de extracción", "Zona de comensales"],
    disponibilidad: "Disponible",
    imagen: "/espacios/streetfood.jpg"
  },
  {
    id: 7,
    nombre: "Zona Boutique",
    zonaGeneral: "Norte",
    caracteristica: "Espacio acotado con iluminación especial",
    evento: "Subsonic Festival 2026",
    lugar: "Entrada secundaria norte",
    tamano: "120m²",
    precio: "1.500€",
    descripcion: "Rincón exclusivo con iluminación cálida y delimitación visual, pensado para marcas de carácter premium.",
    capacidad: "6 stands",
    servicios: ["Electricidad", "Espejos", "Iluminación profesional", "Aire acondicionado"],
    disponibilidad: "Disponible",
    imagen: "/espacios/beauty.jpg"
  },
  {
    id: 8,
    nombre: "Zona Stage",
    zonaGeneral: "Sur",
    caracteristica: "Tarima elevada con gradas laterales",
    evento: "Subsonic Festival 2026",
    lugar: "Extremo sur del recinto",
    tamano: "200m²",
    precio: "5.000€",
    descripcion: "Escenario secundario elevado con gradas a ambos lados, máxima visibilidad desde cualquier ángulo del recinto.",
    capacidad: "1 escenario completo",
    servicios: ["Sistema de sonido completo", "Iluminación profesional", "Backstage", "Generador propio"],
    disponibilidad: "Reservado",
    negocio: { nombre: "SoundWave Events", categoria: "Entretenimiento" },
    imagen: "/espacios/stage.jpg"
  }
];

// -------- ESPACIOS --------
export function getEspacios() {
  return Promise.resolve(espacios);
}

/* ========== USUARIOS ========== */

const usuarios = [
  {
    id: 1,
    tipo: 'cliente',
    nombre: 'Carlos',
    apellido: 'García',
    username: 'carlos_g',
    email: 'carlos@subsonic.com',
    password: 'cliente123',
    descripcion: 'Asistente habitual al festival desde 2021. Fan del techno y el reggaeton.',
    avatar: null
  },
  {
    id: 2,
    tipo: 'proveedor',
    nombre: 'Laura',
    apellido: 'Martínez',
    username: 'laura_m',
    email: 'laura@foodtrucks.com',
    password: 'proveedor123',
    descripcion: 'Propietaria de Food Trucks & Co. Especializada en street food de calidad.',
    avatar: null
  },
  {
    id: 3,
    tipo: 'administrador',
    nombre: 'Admin',
    apellido: 'Subsonic',
    username: 'admin_subsonic',
    email: 'admin@subsonic.com',
    password: 'admin123',
    descripcion: 'Administrador general del Subsonic Festival 2026.',
    avatar: null
  }
];

/* Devuelve todos los usuarios */
export function getUsuarios() {
  return Promise.resolve(usuarios);
}

/* Simula un login: busca por username y tipo */
export function getUsuarioById(id) {
  return Promise.resolve(usuarios.find(u => u.id === id) || null);
}

/* Simula autenticación por email + password */
export function loginUsuario(email, password) {
  const usuario = usuarios.find(u => u.email === email && u.password === password);
  return Promise.resolve(usuario || null);
}