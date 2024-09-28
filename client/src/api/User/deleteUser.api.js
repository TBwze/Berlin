import { getApiInstance } from "../../utils/api.utils";

export async function deleteUser(userId) {
  return getApiInstance()
    .delete(`/user/${userId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw new Error(error.response?.data?.message);
    });
}
