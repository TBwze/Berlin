import { getApiInstance, USER_URL } from '../../utils/api.utils';

export async function deleteUser(userId) {
  return getApiInstance()
    .delete(`${USER_URL}/${userId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw new Error(error.response?.data?.message);
    });
}
