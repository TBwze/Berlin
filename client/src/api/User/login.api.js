import { getApiInstance } from "../../utils/api.utils";
import Cookies from "js-cookie";
export async function loginUser(email, password) {
  try {
    const response = await getApiInstance().post("/user/login", {
      email: email,
      password: password,
    });

    if (response && response.data?.token) {
      Cookies.set("token", response.data.token, { expires: 7 });
    }

    return response;
  } catch (error) {
    throw error.response?.data?.message || "Login failed!";
  }
}
