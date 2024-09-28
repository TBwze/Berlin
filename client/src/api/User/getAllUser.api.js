import { getApiInstance } from "../../utils/api.utils";

export async function getAllUsers() {
  try {
    const response = await getApiInstance().get("/user/all");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
}
