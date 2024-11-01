import { getApiInstance, USER_URL } from "../../utils/api.utils";
export async function logoutUser() {
  try {
    const response = await getApiInstance().post(`${USER_URL}/logout`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}
