import { COMMENT_URL } from '../../utils/api.utils';

export const likeReply = async (commentId, replyId, userId) => {
  try {
    const response = await api.post(`${COMMENT_URL}/${commentId}/replies/${replyId}/like`, {
      userId
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
