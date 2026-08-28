// Error that carries the HTTP status it should be reported with
export class AppError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}
