import { getApiInstance } from "../../utils/api.utils";

export async function registerUser(formData) {
  try {
    const response = await getApiInstance().post("/user", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed!";
  }
}
