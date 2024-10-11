import { getApiInstance, USER_URL } from '../../utils/api.utils';

export async function registerUser(formData) {
  try {
    const response = await getApiInstance().post(`${USER_URL}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed!';
  }
}
