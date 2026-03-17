const API_URL = "/adviser";

import { apiFetch } from "./api";

export const registerStudentRequest = async (student) => {
  return await apiFetch(`${API_URL}/registerStudent`, {
    method: "POST",
    body: JSON.stringify(student)
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