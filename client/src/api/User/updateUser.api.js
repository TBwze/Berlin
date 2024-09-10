import { getApiInstance } from "../../utils/api.utils";

export async function updateUserProfile(formData) {
  try {
    const response = await getApiInstance().put("/user/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error updating profile: " + error.message);
  }
}
