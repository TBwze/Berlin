export const formatResponse = (data, pagination = null) => {
  if (pagination) {
    return {
      status: true,
      message: "Data retrieved successfully",
      page: pagination.page,
      limit: pagination.limit,
      total_pages: pagination.total_pages,
      total_rows: pagination.total_rows,
      data: data
    };
  }
  return {
    status: true,
    message: "Data retrieved successfully",
    data: data
  };
};

export const formatErrorResponse = (error) => {
  return {
    status: false,
    message: error.message || "An error occurred",
    data: null
  };
};
