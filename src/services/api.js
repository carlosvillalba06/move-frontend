const API_URL = "http://10.75.196.237:8080/api/user";

export const apiFetch = async (endpoint, options = {}) => {

  try {

    const token = localStorage.getItem("token");

    const headers = {
      ...(options.body && { "Content-Type": "application/json" }),
      ...(token && { Authorization: Bearer ${token} }),
      ...options.headers
    };

    const response = await fetch(${API_URL}${endpoint}, {
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

      // si el token expiró
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