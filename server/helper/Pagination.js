const calculatePagination = (page = 0, limit = 10, totalItems) => {
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    const totalPages = Math.ceil(totalItems / parsedLimit);

    return {
        page: parsedPage,
        page_limit: parsedLimit,
        total_rows: totalItems,
        total_pages: totalPages,
    };
};

export default calculatePagination;
