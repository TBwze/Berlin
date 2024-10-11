import { getApiInstance, USER_URL } from '../../utils/api.utils';

export async function getAllUsers() {
  try {
    const response = await getApiInstance().get(`${USER_URL}/all`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
}
