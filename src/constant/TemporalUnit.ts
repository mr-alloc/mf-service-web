export default class TemporalUnit {

    static readonly SECOND = new TemporalUnit(1, '초', 1);
    static readonly MINUTE = new TemporalUnit(2, '분', 60);
    static readonly HOUR = new TemporalUnit(3, '시간', 3600);
    static readonly DAY = new TemporalUnit(4, '일', 86400);

    private readonly _value: number;
    private readonly _name: string;
    private readonly _seconds: number;

    constructor(value: number, name: string, seconds: number) {
        this._value = value;
        this._name = name;
        this._seconds = seconds;
    }

    get value(): number {
        return this._value;
    }

    get name(): string {
        return this._name;
    }

    get seconds(): number {
        return this._seconds;
    }

    public static values(): TemporalUnit[] {
        return [
            TemporalUnit.DAY,
            TemporalUnit.HOUR,
            TemporalUnit.MINUTE,
            TemporalUnit.SECOND
        ];
    }

    public toString(): string {
        return `${this._name}: ${this._seconds}`;
    }

    extractHigherUnit(value: number) {
        return TemporalUnit.values()
            .filter(unit => unit._seconds > this._seconds)
            .reduce((pre, cur) => {
                if (pre > 0 && pre < cur._seconds) {
                    return pre;
                }
                const unitValue = Math.floor((value - pre) / cur._seconds);
                const tobeReduced = unitValue * cur._seconds;
                return pre + tobeReduced;
            }, 0);
    }
}
