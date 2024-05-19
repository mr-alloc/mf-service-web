export default class SelectOption {
    private readonly _value: string;
    private readonly _text: string;
    private readonly _color?: string;

    constructor(value: string, text: string, color?: string) {
        this._value = value;
        this._text = text;
        this._color = color;
    }

    get value(): string {
        return this._value;
    }

    get text(): string {
        return this._text;
    }

    get color(): string | undefined {
        return this._color;
    }

    static of(value: string, text: string, color?: string): SelectOption {
        return new SelectOption(value, text, color);
    }

    static ofDefault() {
        return new SelectOption("", "선택", "00000")
    }
}
