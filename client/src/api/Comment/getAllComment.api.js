import { COMMENT_URL, getApiInstance } from "../../utils/api.utils";

export const getAllComments = async (campaignId) => {
  try {
    const response = await getApiInstance().get(`${COMMENT_URL}/${campaignId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
