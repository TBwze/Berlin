import { COMMENT_URL, getApiInstance } from '../../utils/api.utils';

export const unlikeComment = async (commentId, userId) => {
  try {
    const response = await getApiInstance().post(`${COMMENT_URL}/${commentId}/unlike`, {
      userId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
