import { COMMENT_URL, getApiInstance } from '../../utils/api.utils';

export const postComment = async (campaignId, userId, content, parentId = null) => {
  try {
    const response = await getApiInstance().post(`${COMMENT_URL}`, {
      campaignId,
      user: userId,
      content,
      parentId
    });
    return response.data;
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
};
