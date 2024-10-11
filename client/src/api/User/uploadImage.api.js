import { getApiInstance, USER_URL } from '../../utils/api.utils';

export async function uploadProfilePicture(formData) {
  try {
    const response = await getApiInstance().post(`${USER_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error uploading image: ' + error.response?.data?.message);
  }
}
