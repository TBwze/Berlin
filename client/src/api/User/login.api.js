import { getApiInstance, USER_URL } from '../../utils/api.utils';
import Cookies from 'js-cookie';
export async function loginUser(email, password, wallet) {
  try {
    const response = await getApiInstance().post(`${USER_URL}/login`, {
      email: email,
      password: password,
      wallet: wallet
    });

    if (response && response.data?.token) {
      Cookies.set('token', response.data.token, { expires: 1 });
    }

    return response;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed!';
  }
}
