class ApiError extends Error{

    constructor(statusCode,message,error){
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.error = error
    }
}