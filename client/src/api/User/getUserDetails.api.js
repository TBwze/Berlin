import { getApiInstance, USER_URL } from '../../utils/api.utils';
import Cookies from 'js-cookie';

export async function getUserDetails() {
  try {
    const response = await getApiInstance().get(`${USER_URL}/account`);
    return response.data;
  } catch (error) {
    const statusCode = error.response?.status;

    if (statusCode === 403) {
      Cookies.remove('token');

      throw new Error('Session expired. Please log in again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch user details');
  }
}
