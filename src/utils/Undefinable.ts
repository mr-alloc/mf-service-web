type force = {};
export class Undefinable<T> {

    private static readonly UNDEFINED = new Undefinable<undefined>(undefined);
    private readonly _value: T;

    private constructor(value: T) {
        this._value = value;
    }

    static ex<T>(value: T | undefined) {
        return value === undefined ? Undefinable.UNDEFINED : new Undefinable(value);
    }

    is(condition: (value: T) => boolean): boolean {
        return this._value !== undefined && condition(this._value);
    }

    num(defaultValue?: number): number {
        if (defaultValue && this.no()) {
            return defaultValue;
        }
        return this._value === undefined ? 0 : this._value as number;
    }

    str(): string {
        return this._value === undefined ? "" : this._value as string;
    }

    no(): boolean {
        return this._value === undefined;
    }

    get(): force {
        return this._value!;
    }
}

export const ex = Undefinable.ex;
