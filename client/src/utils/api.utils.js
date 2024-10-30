import axios from "axios";

export const API_BASE_URL = "http://localhost:5000";
export const USER_URL = "/user";
export const COMMENT_URL = "/comment";

export function getApiInstance() {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json"
    },
    withCredentials: true
  });

  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
}
