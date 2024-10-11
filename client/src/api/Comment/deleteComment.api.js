import { COMMENT_URL, getApiInstance } from '../../utils/api.utils';

export const deleteComment = async (commentId) => {
  try {
    const response = await getApiInstance().delete(`${COMMENT_URL}/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
