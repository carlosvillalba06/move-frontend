const API_URL = "http://localhost:8080/api";

export const apiFetch = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem("token");

    const isFormData = options.body instanceof FormData;

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

    if (!response.ok) {

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

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