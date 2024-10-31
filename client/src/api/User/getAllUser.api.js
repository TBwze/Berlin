import { getApiInstance, USER_URL } from "../../utils/api.utils";

export async function getAllUsers(page = 0, limit = 10, username = null) {
  try {
    const response = await getApiInstance().get(`${USER_URL}/all?page=${page}&limit=${limit}&username=${username}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}
