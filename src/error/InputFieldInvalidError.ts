export class InputFieldInvalidError extends Error {

    private readonly code: number;

    constructor(message: string, code: number) {
        super(message);
        this.name = "InputFieldInvalidError";
        this.code = code;
    }

    get getCode(): number {
        return this.code;
    }
}
