import { COMMENT_URL, getApiInstance } from '../../utils/api.utils';

export const postReply = async (commentId, user, content) => {
  try {
    const response = await getApiInstance().post(`${COMMENT_URL}/${commentId}/replies`, {
      user,
      content
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
