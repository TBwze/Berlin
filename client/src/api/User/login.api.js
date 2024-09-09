import { getApiInstance } from "../../utils/api.utils";

export async function loginUser(email, password) {
  try {
    const response = await getApiInstance().post("/user/login", {
      email: email,
      password: password,
    });

    // Check if the token exists in the response data
    if (response && response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response;
  } catch (error) {
    throw error.response?.data?.message || "Login failed!";
  }
}
