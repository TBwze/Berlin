import { COMMENT_URL, getApiInstance } from '../../utils/api.utils';

export const postComment = async (campaignId, user, content) => {
  try {
    const response = await getApiInstance().post(`${COMMENT_URL}`, { campaignId, user, content });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
