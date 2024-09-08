export const API_BASE_URL = "http://localhost:5000";
import axios from "axios";

export function getApiInstance() {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
