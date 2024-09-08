import { getApiInstance } from "../../utils/api.utils";

export async function registerUser(userData) {
  try {
    const response = await getApiInstance().post("/user", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
}
