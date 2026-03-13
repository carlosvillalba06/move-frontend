const API_URL = "http://10.75.196.237:8080/api/user";

export const apiFetch = async (endpoint, options = {}) => {

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  let data = null;

  const text = await response.text();

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text }; // si no es JSON lo guarda como texto
  }

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición");
  }

  return data;
};