import { getApiInstance } from "../../utils/api.utils";

export async function updateUserProfile(id, formData) {
  try {
    const response = await getApiInstance().put(`/user/update/${id}`, formData);
    return response.data;
  } catch (error) {
    throw new Error("Error updating profile: " + error.message);
  }
}
