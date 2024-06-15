export default class Pair<L, R> {
    private readonly _left: L;
    private readonly _right: R;

    constructor(left: L, right: R) {
        this._left = left;
        this._right = right;
    }

    get left(): L {
        return this._left;
    }

    get right(): R {
        return this._right;
    }

    public toString(): string {
        return `(${this._left}, ${this._right})`;
    }

    public static of<L, R>(left: L, right: R): Pair<L, R> {
        return new Pair(left, right);
    }
}
