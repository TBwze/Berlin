import { COMMENT_URL, getApiInstance } from "../../utils/api.utils";

export const getAllComments = async (campaignId, page, limit) => {
  try {
    const response = await getApiInstance().get(
      `${COMMENT_URL}/${campaignId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
