import { COMMENT_URL, getApiInstance } from '../../utils/api.utils';

export const deleteReply = async (commentId, replyId) => {
  try {
    const response = await getApiInstance().delete(
      `${COMMENT_URL}/${commentId}/replies/${replyId}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data; 
  }
};
