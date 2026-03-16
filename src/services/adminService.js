import { apiFetch } from "./Api";


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

  const formData = new FormData();
  formData.append("file", file);

  return await apiFetch("/admin/uploadLogo", {
    method: "POST",
    body: formData,
    headers: {} // importante porque FormData no usa JSON
  });
};