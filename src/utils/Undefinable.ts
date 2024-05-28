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
}

export const ex = Undefinable.ex;
