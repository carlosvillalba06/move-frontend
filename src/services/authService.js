import { apiFetch } from "./Api";

export const loginRequest = async (email, password) => {

  const data = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
};

export const verifyCodeRequest = async (email, code) => {
  return await apiFetch("/validateCode", {
    method: "POST",
    body: JSON.stringify({
      email,
      code
    })
  });
};

export const registerRequest = async (email) => {

  return await apiFetch(`/sendCode?email=${email}`, {
    method: "POST",
    body: JSON.stringify({
      email
    })
  });

};

export const setPasswordRequest = async (password) => {

  const email = localStorage.getItem("email");

  return await apiFetch("/addPassword", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });

};
export const resetPasswordRequest = async (password, token) => {

  return await apiFetch("/addPassword", {
    method: "POST",
    body: JSON.stringify({
      password,
      token
    })
  });

};