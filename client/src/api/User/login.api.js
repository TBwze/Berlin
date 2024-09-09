import { getApiInstance } from "../../utils/api.utils";

export async function loginUser(email, password) {
  try {
    const response = await getApiInstance().post("/user/login", {
      email: email,
      password: password,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed!";
  }
}
