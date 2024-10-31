export const handleSuccessResponse = (
    response,
    status_code,
    message,
    data = null
) => {
    response.status(status_code).json({
        status_code,
        message,
        data,
    });
};
export const handleErrorResponse = (response, status_code, message) => {
    response.status(status_code).json({
        status_code,
        message,
    });
};

export const handleResponsePagination = (
    page,
    limit,
    total_pages,
    total_rows,
    response,
    status_code,
    message,
    data = null
) => {
    response.status(status_code).json({
        status_code,
        page,
        limit,
        total_pages,
        total_rows,
        message,
        data,
    });
};
