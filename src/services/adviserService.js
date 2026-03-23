const API_URL = "/adviser";

import { apiFetch } from "./api";

// Registrar estudiante
export const registerStudentRequest = async (student) => {
  return await apiFetch(`${API_URL}/registerStudent`, {
    method: "POST",
    body: JSON.stringify(student)
  });
};

// Agregar estudiante al board
export const addStudentToBoardRequest = async (email) => {
  return await apiFetch(`${API_URL}/addStudentToBoard`, {
    method: "POST",
    body: JSON.stringify({ email })
  });
};

// Obtener todos los estudiantes
export const getAllStudentsRequest = async () => {
  return await apiFetch(`${API_URL}/getAllStudents`, {
    method: "GET"
  });
};

// Deshabilitar estudiante del board
export const disableBoardStudentRequest = async (id) => {
  return await apiFetch(`${API_URL}/disableBoardStudent?id=${id}`, {
    method: "POST"
  });
};

// Habilitar estudiante del board
export const enableBoardStudentRequest = async (id) => {
  return await apiFetch(`${API_URL}/enableBoardStudent?id=${id}`, {
    method: "POST"
  });
};


// Subir logo (multipart/form-data)
export const uploadLogoAdviserRequest = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return await apiFetch(`${API_URL}/uploadLogo`, {
    method: "POST",
    body: formData,
    headers: {}
  });
};

// Actualizar información del adviser
export const updateAdviserInformationRequest = async (adviserData) => {
  return await apiFetch(`${API_URL}/updateAdivserInformation`, {
    method: "POST",
    body: JSON.stringify(adviserData)
  });
};

// Obtener información del adviser
export const getAdviserInformationRequest = async () => {
  return await apiFetch(`${API_URL}/getAdviserInformation`, {
    method: "GET"
  });
};

export const addTaskRequest = async (formData) => {
  return await apiFetch(`/adviser/addTask`, {
    method: "POST",
    body: formData
  });
};