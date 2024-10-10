import { COMMENT_URL, getApiInstance } from '../../utils/api.utils';

export const getAllComment = async (campaignId) => {
  try {
    const response = await getApiInstance().get(`${COMMENT_URL}/${campaignId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
