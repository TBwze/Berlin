import { getApiInstance, USER_URL } from "../../utils/api.utils";

export async function getUserDetails() {
  try {
    const response = await getApiInstance().get(`${USER_URL}/account`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user details");
  }
}
