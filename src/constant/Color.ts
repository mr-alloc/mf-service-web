export default class Color {

    static readonly RED = new Color("#e65b5b");
    static readonly GREEN = new Color("#6bdf6b");
    static readonly BLUE = new Color("#4242e1");
    static readonly YELLOW = new Color("#f1f130");
    static readonly BLACK = new Color("#454343");

    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    get value(): string {
        return this._value;
    }


    public toString() {
        return `color:#${this._value};`;
    }
}
