export default class Period {
    private readonly _startAt: number;
    private readonly _endAt: number;

    constructor(startAt: number, endAt: number) {
        this._startAt = startAt;
        this._endAt = endAt;
    }

    get startAt(): number {
        return this._startAt;
    }

    get endAt(): number {
        return this._endAt;
    }

    public static of(startAt: number, endAt: number): Period {
        return new Period(startAt, endAt);
    }
}
