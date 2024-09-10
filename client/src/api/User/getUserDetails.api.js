import { getApiInstance } from "../../utils/api.utils";

export async function getUserDetails() {
  try {
    const response = await getApiInstance().get("/user/account");
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
}
