export default class SelectOption {
    private readonly _value: string;
    private readonly _text: string;

    constructor(value: string, text: string) {
        this._value = value;
        this._text = text;
    }

    get value(): string {
        return this._value;
    }

    get text(): string {
        return this._text;
    }

    static of(value: string, text: string): SelectOption {
        return new SelectOption(value, text);
    }
}
