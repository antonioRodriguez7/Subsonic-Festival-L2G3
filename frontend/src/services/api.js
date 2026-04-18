/* ============================================================
   api.js - PUNTO DE ENTRADA ÚNICO PARA EL FRONTEND
   ============================================================ */

import * as fake from "./fakeBackend";
import * as real from "./realBackend";

// Cambia a 'true' si el servidor Spring Boot (8080) está apagado
const usarBackendFalso = false;

const backend = usarBackendFalso ? fake : real;

/* ------------------------------------------------------------
   1. ENTIDADES DE LECTURA (GET)
   Funcionan con Fake (si está activo) o Real
   ------------------------------------------------------------ */

// Entradas / Tickets
export const getEntradas = backend.getEntradas;

// Artistas / Lineup
export const getArtistas = backend.getArtistas;

// Espacios / Logistics
export const getEspacios = backend.getEspacios;
export const getEspaciosDisponibles = backend.getEspaciosDisponibles;

// FAQ y Otros
export const getFaqsUsuarios = backend.getFaqsUsuarios;
export const getFaqsProveedores = backend.getFaqsProveedores;


/* ------------------------------------------------------------
   2. AUTENTICACIÓN Y USUARIOS
   ------------------------------------------------------------ */

export const loginUsuario = backend.loginUsuario;
export const registrarUsuario = backend.registrarUsuario;
export const getUsuarios = backend.getUsuarios;
export const getUsuarioById = backend.getUsuarioById;
export const getCurrentUser = backend.getCurrentUser;
export const updateUser = real.updateUser;
export const deleteUser = real.deleteUser;


/* ------------------------------------------------------------
   3. OPERACIONES DE ESCRITURA (POST / PUT / DELETE)
   Estas SIEMPRE van al realBackend (Spring Boot)
   ------------------------------------------------------------ */

// --- ARTISTAS ---
export const createArtist = real.createArtist;
export const updateArtist = real.updateArtist;
export const deleteArtist = real.deleteArtist;

// --- TICKETS / ENTRADAS ---
export const createTicket = real.createTicket;
export const updateTicket = real.updateTicket;
export const updateTicketWithImage = real.updateTicketWithImage;
export const deleteTicket = real.deleteTicket;

// --- ESPACIOS (NUEVO) ---
export const createSpace = real.createSpace;
export const updateSpace = real.updateSpace;
export const deleteSpace = real.deleteSpace;
export const rentSpace = real.rentSpace;         // PUT /api/spaces/:id (marcar como alquilado)
export const assignSpaceToService = real.assignSpaceToService;
export const unassignSpaceFromService = real.unassignSpaceFromService;

/* ------------------------------------------------------------
   5. SPOTIFY SYNC
   ------------------------------------------------------------ */

export const syncSpotifyPlaylist = real.syncSpotifyPlaylist;

/* ------------------------------------------------------------
   6. LOGÍSTICA ESPECÍFICA PROVEEDORES
   ------------------------------------------------------------ */

export const getEspaciosContratadosProveedor = real.getEspaciosContratadosProveedor;
export const getServiciosProveedor = backend.getServiciosProveedor;
export const createService = real.createService;
export const updateService = real.updateService;
export const deleteService = real.deleteService;
export const getAllServices = real.getAllServices;
