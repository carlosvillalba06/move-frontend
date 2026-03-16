import { apiFetch } from "./Api";

export const loginRequest = async (email, password) => {
  const data = await apiFetch("/user/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  if (data?.token) localStorage.setItem("token", data.token);
  return data;
};

export const registerRequest = async (email) => {
  localStorage.setItem("email", email);
  return await apiFetch(`/user/sendCode?email=${email}`, {
    method: "POST"
  });
};

export const verifyCodeRequest = async (email, code) => {
  localStorage.setItem("email", email);
  const data = await apiFetch("/user/validateCode", {
    method: "POST",
    body: JSON.stringify({ email, code })
  });

  if (data?.passwordToken) localStorage.setItem("passwordToken", data.passwordToken);
  return data;
};

export const setPasswordRequest = async (password) => {
  const email = localStorage.getItem("email");
  const passwordToken = localStorage.getItem("passwordToken");

  return await apiFetch("/user/addPassword", {
    method: "POST",
    body: JSON.stringify({ email, password, passwordToken })
  });
};

export const resetPasswordRequest = async (email) => {
  localStorage.setItem("email", email);
  return await apiFetch(`/user/changePassword?email=${email}`, {
    method: "POST"
  });
};

export const disableUserRequest = async (email) => {
  return await apiFetch(`/user/disableUser?email=${email}`, {
    method: "POST"
  });
};

export const enableUserRequest = async (email) => {
  return await apiFetch(`/user/enableUser?email=${email}`, {
    method: "POST"
  });
};