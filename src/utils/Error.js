export const errorHandler = (statusCode,message)=> {
    const error     = new Error();
    error.status    = statusCode;
    error.success   = false;
    error.message   = message;
    return error
}