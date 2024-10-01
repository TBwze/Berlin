import { getApiInstance } from '../../utils/api.utils';

export async function getAccountByWallet(walletAddress) {
  try {
    const response = await getApiInstance().get(`/user/by-wallet`, {
      params: { wallet: walletAddress }
    });

    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}
