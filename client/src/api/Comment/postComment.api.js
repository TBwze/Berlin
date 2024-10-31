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
    throw new Error(error.response.data.message);
  }
};
