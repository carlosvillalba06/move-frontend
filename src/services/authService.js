import { apiFetch } from "./Api";

export const loginRequest = async (email, password) => {
  const data = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  if (data?.token) localStorage.setItem("token", data.token);
  return data;
};

export const registerRequest = async (email) => {
  localStorage.setItem("email", email);
  return await apiFetch(`/sendCode?email=${email}`, {
    method: "POST"
  });
};

export const verifyCodeRequest = async (email, code) => {
  localStorage.setItem("email", email);
  const data = await apiFetch("/validateCode", {
    method: "POST",
    body: JSON.stringify({ email, code })
  });

  if (data?.passwordToken) localStorage.setItem("passwordToken", data.passwordToken);
  return data;
};

export const setPasswordRequest = async (password) => {
  const email = localStorage.getItem("email");
  const passwordToken = localStorage.getItem("passwordToken");

  return await apiFetch("/addPassword", {
    method: "POST",
    body: JSON.stringify({ email, password, passwordToken })
  });
};

export const resetPasswordRequest = async (email) => {
  localStorage.setItem("email", email);
  return await apiFetch(`/changePassword?email=${email}`, {
    method: "POST"
  });
};

export const disableUserRequest = async (email) => {
  return await apiFetch(`/disableUser?email=${email}`, {
    method: "POST"
  });
};

export const enableUserRequest = async (email) => {
  return await apiFetch(`/enableUser?email=${email}`, {
    method: "POST"
  });
};