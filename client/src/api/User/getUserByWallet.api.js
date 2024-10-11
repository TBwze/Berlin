import { getApiInstance, USER_URL } from '../../utils/api.utils';

export async function getAccountByWallet(walletAddress) {
  try {
    const response = await getApiInstance().get(`${USER_URL}/by-wallet`, {
      params: { wallet: walletAddress }
    });

    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}
