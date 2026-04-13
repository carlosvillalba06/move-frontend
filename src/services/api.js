const API_URL = "http://localhost:8080/api";

export const apiFetch = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem("token");

    // 🔍 Detectar si es FormData
    const isFormData = options.body instanceof FormData;

    // ✅ Headers corregidos
    const headers = {
      ...(options.headers || {}),
      ...(!isFormData && options.body && { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    const text = await response.text();

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    // 🔴 Manejo de errores HTTP
    if (!response.ok) {

      // 🔥 401 → token inválido o expirado
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      // 🔥 403 → problema de permisos o JWT corrupto
      if (response.status === 403) {
        console.error("Acceso denegado (403). Posible problema con el token JWT.");
      }

      throw new Error(data.message || `Error ${response.status}`);
    }

    return data;

  } catch (error) {
    console.error("API ERROR:", error);
    throw new Error(error.message || "Error de conexión con el servidor");
  }
};