import { apiFetch } from "./api";
const API_URL = "/admin";


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


// Obtener informacion del admin
export const getAdminInformationRequest = async () => {
  return await apiFetch("/admin/getAdminInformation", {
    method: "GET"
  });
};

// Subir logo del admin
export const uploadLogoRequest = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return await apiFetch("/admin/uploadLogo", {
    method: "POST",
    body: formData
  });
};

// Actualizar informacion del admin
export const updateAdminInformationRequest = async (adminData) => {
  return await apiFetch(`${API_URL}/updateAdminInformation`, {
    method: "POST",
    body: JSON.stringify(adminData)
  });
};
