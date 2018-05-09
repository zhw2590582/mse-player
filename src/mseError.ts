export default class MseError extends Error {
    constructor(message: string, context?: Function) {
        super(message);
        // @ts-ignore
        Error.captureStackTrace(this, context);
        this.name = 'MseError';
    }
}