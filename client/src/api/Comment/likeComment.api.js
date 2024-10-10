import { COMMENT_URL, getApiInstance } from '../../utils/api.utils';

export const likeComment = async (commentId, userId) => {
  try {
    const response = await getApiInstance().post(`${COMMENT_URL}/${commentId}/like`, { userId });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
