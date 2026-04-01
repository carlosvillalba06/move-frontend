const API_URL = "/adviser";

import { apiFetch } from "./api";

/* =========================
   STUDENTS
========================= */

export const registerStudentRequest = async ({ email, firstName, lastName }) => {
  return await apiFetch(`${API_URL}/registerStudent`, {
    method: "POST",
    body: JSON.stringify({
      email,
      firstName,
      lastName
    })
  });
};

export const addStudentToBoardRequest = async (email) => {
  return await apiFetch(`${API_URL}/addStudentToBoard`, {
    method: "POST",
    body: JSON.stringify({ email })
  });
};

export const getAllStudentsRequest = async () => {
  return await apiFetch(`${API_URL}/getAllStudents`, {
    method: "GET"
  });
};

export const disableBoardStudentRequest = async (id) => {
  return await apiFetch(`${API_URL}/disableBoardStudent?id=${id}`, {
    method: "POST"
  });
};

export const enableBoardStudentRequest = async (id) => {
  return await apiFetch(`${API_URL}/enableBoardStudent?id=${id}`, {
    method: "POST"
  });
};


/* =========================
   ADVISER
========================= */

export const uploadLogoAdviserRequest = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return await apiFetch("/adviser/uploadLogo", {
    method: "POST",
    body: formData
  });
};

export const updateAdviserInformationRequest = async ({ firstName, lastName }) => {
  return await apiFetch(`${API_URL}/updateAdivserInformation`, {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName
    })
  });
};

export const getAdviserInformationRequest = async () => {
  return await apiFetch(`${API_URL}/getAdviserInformation`, {
    method: "GET"
  });
};


/* =========================
   TASKS
========================= */

export const addTaskRequest = async (formData) => {
  return await apiFetch(`${API_URL}/createTask`, {
    method: "POST",
    body: formData
  });
};

export const getTasksRequest = async () => {
  return await apiFetch(`${API_URL}/getTasks`, {
    method: "GET"
  });
};

export const deleteTaskRequest = async (id) => {
  return await apiFetch(`${API_URL}/deleteTask/${id}`, {
    method: "DELETE"
  });
};

export const updateTaskRequest = async (id, data) => {
  return apiFetch(`/adviser/task/${id}`, {
    method: "PUT",
    body: data
  });
};
const statusMap = {
  "TODO": "ToDo",
  "IN_PROGRESS": "Doing",
  "DONE": "Done"
};

export const updateTaskStatusRequest = async (id, status) => {
  return await apiFetch(`${API_URL}/task/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ 
      status: statusMap[status] 
    })
  });
};