export const calculatePagination = (totalItems, page = 0, limit = 10) => {
  const total_pages = Math.ceil(totalItems / limit);
  return {
    page: page,
    limit: limit,
    total_pages: total_pages,
    total_rows: totalItems
  };
};
