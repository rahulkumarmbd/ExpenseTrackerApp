import axios from "axios";
const API_KEY = "AIzaSyDZ7izwlbSDY1XWmuNgjLcN5o6_vQumNUo";

const authenticate = async (mode, email, password) => {
  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`,
    { email, password, returnSecureToken: true }
  );

  return response.data.idToken;
};

export const login = (email, password) => {
  return authenticate("signInWithPassword", email, password);
};

export const signup = (email, password) => {
  return authenticate("signUp", email, password);
};
