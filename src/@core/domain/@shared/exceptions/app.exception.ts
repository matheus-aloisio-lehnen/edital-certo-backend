export class AppException extends Error {

    code: string;
    statusCode: number;
    message: string;

    constructor(code: string, statusCode: number, message: string = "") {
        super(message || code);
        this.code = code;
        this.statusCode = statusCode;
        this.message = message || code;
    }

}
