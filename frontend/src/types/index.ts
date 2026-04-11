export interface Artista {
  id: number;
  nombre: string;
  dia: string;
  img: string;
  spoty: string;
}

export interface Entrada {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  etiqueta: string;
  tipoEtiqueta: string;
  estado: "DISPONIBLE" | "AGOTADA" | "PROXIMAMENTE";
  img: string;
}

export interface Espacio {
  id: number;
  nombre: string;
  zonaGeneral: string;
  caracteristica: string;
  tipo: string;
  evento: string;
  lugar: string;
  tamano: string;
  precio: number;
  ubicacion: string;
  descripcion: string;
  capacidad: string;
  servicios: string[];
  disponibilidad: string;
  imagen: string;
  negocioNombre?: string; 
  negocioCategoria?: string;
}

export interface Servicio {
  id: number;
  espacioId: number;
  espacioNombre: string;
  proveedorId: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  fechas: string;
}

export interface Faq {
  id: number;
  pregunta: string;
  respuesta: string;
}
