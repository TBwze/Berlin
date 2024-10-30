import { getApiInstance, USER_URL } from "../../utils/api.utils";
export async function loginUser(email, password, wallet) {
  try {
    const response = await getApiInstance().post(`${USER_URL}/login`, {
      email,
      password,
      wallet
    });

    return response;
  } catch (error) {
    throw error.response?.data?.message || "Login failed!";
  }
}
