export const ApiResponse = (statusCode, message, data) => {
    const response = {}
    response.statusCode = statusCode;
    response.message = message;
    response.data = data
    return response
}