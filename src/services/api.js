const API_URL = "http://localhost:8080/api";


export const apiFetch = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem("token");

    const isFormData = options.body instanceof FormData;

    const headers = {
      ...(!isFormData && options.body && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
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

      throw new Error(data.message || "Error en la petición");
    }

    return data;

  } catch (error) {
    throw new Error(error.message || "Error de conexión con el servidor");
  }
};