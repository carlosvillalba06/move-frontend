import { apiFetch } from "./api";


// Registrar asesor
export const registerAdvisorRequest = async (advisor) => {
  return await apiFetch("/admin/registerAdvisorUser", {
    method: "POST",
    body: JSON.stringify(advisor)
  });
};


// Obtener todos los asesores
export const getAllAdvisersRequest = async () => {
  return await apiFetch("/admin/getAllAdvisers", {
    method: "GET"
  });
};


// Obtener todos los tableros
export const getAllBoardsRequest = async () => {
  return await apiFetch("/admin/getAllBoards", {
    method: "GET"
  });
};


// Obtener información del admin
export const getAdminInformationRequest = async () => {
  return await apiFetch("/admin/getAdminInformation", {
    method: "GET"
  });
};

// Subir logo del admin
export const uploadLogoRequest = async (file) => {

  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:8080/api/admin/uploadLogo", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error("Error subiendo imagen");
  }

  return response.json();
};