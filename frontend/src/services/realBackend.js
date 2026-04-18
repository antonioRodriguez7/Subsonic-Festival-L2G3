import axios from 'axios';

const URL_BASE = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: URL_BASE
});

// Interceptor para añadir el Token automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('subsonic_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/* ========== ARTISTAS (Artists - 8080) ========== */
export async function getArtistas() {
    const response = await api.get('/artists/all');
    return response.data;
}


export async function createArtist(artistData) {
    // 1. Calculamos fecha ISO (2026-MM-DD)
    const MESES_ISO = {
        'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
        'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
        'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
    };
    const mesISO = MESES_ISO[(artistData.mes || '').toLowerCase()] || '07';
    const diaLimpio = (artistData.diaMes || '18').toString().padStart(2, '0');
    const isoDate = `2026-${mesISO}-${diaLimpio}`;

    if (artistData.imageFile) {
        const formData = new FormData();
        formData.append("name", artistData.nombre || artistData.name || "Nuevo Artista");
        formData.append("spotifyUrl", artistData.spotifyUrl || "");
        formData.append("performanceDate", isoDate);
        formData.append("genre", artistData.genero || artistData.genre || "Electronic");
        formData.append("description", artistData.description || "Artista añadido desde el panel");
        formData.append("stage", artistData.escenario || artistData.stage || "Main Stage");
        formData.append("image", artistData.imageFile);

        const response = await api.post('/artists/withImage', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }

    // 2. Mapeo
    const dataParaJava = {
        name: artistData.nombre || artistData.name || "Nuevo Artista",
        spotifyUrl: artistData.spotifyUrl || "",
        imageUrl: artistData.imagenUrl || artistData.imageUrl || "https://via.placeholder.com/300",
        performanceDate: isoDate,
        genre: artistData.genero || artistData.genre || "Electronic",
        description: artistData.description || "Artista añadido desde el panel",
        stage: artistData.escenario || artistData.stage || "Main Stage"
    };

    console.log("🚀 Payload final enviado a Java:", dataParaJava);

    const response = await api.post('/artists', dataParaJava);
    return response.data;
}

export async function deleteArtist(id) {
    const response = await api.delete(`/artists/${id}`);
    return response.data;
}

export async function updateArtist(id, artistData) {
    // 1. Calculamos fecha ISO (2026-MM-DD)
    const MESES_ISO = {
        'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
        'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
        'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
    };
    const mesISO = MESES_ISO[(artistData.mes || '').toLowerCase()] || '07';
    const diaLimpio = (artistData.diaMes || '18').toString().padStart(2, '0');
    const isoDate = `2026-${mesISO}-${diaLimpio}`;

    if (artistData.imageFile) {
        const formData = new FormData();
        formData.append("name", artistData.nombre || artistData.name);
        formData.append("spotifyUrl", artistData.spotifyUrl || "");
        formData.append("performanceDate", isoDate);
        formData.append("genre", artistData.genero || artistData.genre || "Electronic");
        formData.append("description", artistData.description || "Artista actualizado desde el panel");
        formData.append("stage", artistData.escenario || artistData.stage || "Main Stage");
        formData.append("image", artistData.imageFile);

        const response = await api.put(`/artists/${id}/withImage`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }

    // 2. Mapeo
    const dataParaJava = {
        name: artistData.nombre || artistData.name,
        spotifyUrl: artistData.spotifyUrl,
        imageUrl: artistData.imagenUrl || artistData.imageUrl,
        performanceDate: isoDate,
        genre: artistData.genero || artistData.genre || "Electronic",
        description: artistData.description || "Artista actualizado desde el panel",
        stage: artistData.escenario || artistData.stage || "Main Stage"
    };
    const response = await api.put(`/artists/${id}`, dataParaJava);
    return response.data;
}

/* ========== SPOTIFY (Spotify - 8080) ========== */

export async function syncSpotifyPlaylist() {
    console.log("🚀 Solicitando sincronización a Java...");
    const response = await api.post('/spotify/sync');
    return response.data;
}

/* ========== ENTRADAS / TICKETS (Tickets - 8080) ========== */
export async function getEntradas() {
    const response = await api.get('/tickets/all');
    return response.data;
}

export async function createTicket(ticketData) {
    const formData = new FormData();
    formData.append("category", ticketData.category || ticketData.categoria);
    const description = ticketData.description || ticketData.descripcion;
    if (description) formData.append("description", description);
    formData.append("price", parseFloat(ticketData.price || ticketData.precio));
    formData.append("feature", ticketData.feature || ticketData.caracteristica || "Acceso estándar");
    formData.append("stock", ticketData.stock !== undefined && !isNaN(parseInt(ticketData.stock)) ? parseInt(ticketData.stock) : 100);

    if (ticketData.imageFile) {
        formData.append("image", ticketData.imageFile);
    } // If no image, Backend @RequestParam is now required=false and assigns a default.

    const response = await api.post('/tickets', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export async function deleteTicket(id) {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
}

export async function updateTicket(id, ticketData) {
    const dataParaJava = {
        category: ticketData.categoria || ticketData.category,
        description: ticketData.descripcion || ticketData.description,
        price: parseFloat(ticketData.precio || ticketData.price),
        feature: ticketData.caracteristica || ticketData.feature || "Acceso estándar",
        imageUrl: ticketData.imagenUrl || ticketData.imageUrl || "https://via.placeholder.com/300",
        stock: parseInt(ticketData.stock) || 100
    };
    const response = await api.put(`/tickets/${id}`, dataParaJava);
    return response.data;
}

export async function updateTicketWithImage(id, formData) {
    const response = await api.put(`/tickets/${id}/withImage`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export async function buyTicket(ticketId, quantity) {
    const data = {
        ticketId: ticketId,
        cantidad: quantity
    };

    const response = await api.post(`/purchases/buy`, data);
    return response.data;
}

export async function sendPdfEmail(pdfBlob) {
    const formData = new FormData();
    formData.append("pdf", pdfBlob, "entradas-subsonic.pdf");

    const response = await api.post('/purchases/send-email', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export async function sendInvoiceEmail(pdfBlob) {
    const formData = new FormData();
    formData.append("pdf", pdfBlob, "factura-subsonic.pdf");

    const response = await api.post('/purchases/send-invoice-email', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export async function getMyTickets() {
    const userId = localStorage.getItem("user_id");

    if (!userId || userId === "null" || userId === "undefined") {
        return [];
    }

    const response = await api.get(`/purchases/user/${userId}`);

    return response.data;
}

// --- ESPACIOS (Spaces - 8080) ---

// Obtener todos los espacios
export async function getEspacios() {
    const response = await api.get('/spaces/all');
    return response.data;
}

// Obtener espacios disponibles
export async function getEspaciosDisponibles() {
    const response = await api.get('/spaces/available');
    return response.data;
}

// Crear un espacio
export async function createSpace(spaceData) {
    const dataParaJava = {
        name: spaceData.name,
        type: spaceData.type,
        price: parseFloat(spaceData.price),
        sizeSquareMeters: parseInt(spaceData.sizeSquareMeters),
        isRented: spaceData.isRented || false
    };
    const response = await api.post('/spaces', dataParaJava);
    return response.data;
}

// Actualizar un espacio
export async function updateSpace(id, spaceData) {
    const response = await api.put(`/spaces/${id}`, spaceData);
    return response.data;
}

// Alquilar un espacio — guarda al proveedor autenticado (via JWT) en la BD
export async function rentSpace(spaceId) {
    const response = await api.put(`/spaces/${spaceId}/rent`);
    return response.data;
}

// Obtener los espacios contratados por el proveedor autenticado
export async function getEspaciosContratadosProveedor() {
    const response = await api.get('/spaces/my-rented');
    return response.data;
}

// Eliminar un espacio
export async function deleteSpace(id) {
    const response = await api.delete(`/spaces/${id}`);
    return response.data;
}

/* ========== SERVICIOS (Services - Prototipo) ========== */

// Nota: Como no hay ServiceController aún, usamos localStorage o simulamos la persistencia
// para que el usuario vea que "se crea" y luego pueda elegirlo al contratar el espacio.

export async function getAllServices() {
    const response = await api.get('/services');
    return response.data;
}

export async function getServiciosProveedor() {
    const response = await api.get('/services/provider');
    return response.data;
}

export async function createService(serviceData) {
    const response = await api.post('/services', serviceData);
    return response.data;
}

export async function updateService(id, serviceData) {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
}

export async function deleteService(id) {
    const response = await api.delete(`/services/${id}`);
    return response.data;
}

export async function assignSpaceToService(serviceId, spaceId) {
    const response = await api.put(`/services/${serviceId}/space/${spaceId}`);
    return response.data;
}

export async function unassignSpaceFromService(serviceId) {
    const response = await api.delete(`/services/${serviceId}/space`);
    return response.data;
}

/* ========== USUARIOS & AUTENTICACIÓN ========== */
export async function loginUsuario(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.token) {
        localStorage.setItem('subsonic_token', response.data.token);
        localStorage.setItem('user_id', response.data.id);
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_role', response.data.role);
        console.log("Logged in with role:", response.data.role); // Added for debugging
    }
    return response.data;
}

export async function registrarUsuario(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data && response.data.token) {
        localStorage.setItem('subsonic_token', response.data.token);
        localStorage.setItem('user_id', response.data.id);
        localStorage.setItem('user_email', userData.email);
        localStorage.setItem('user_role', response.data.role);
    }
    return response.data;
}

export async function getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
}

export async function updateUser(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
}

export async function deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
}

export async function getUsuarios() {
    const response = await api.get('/users/all');
    return response.data;
}

// PAYPAL
