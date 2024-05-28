export default class AnniversaryType {

    static readonly PERIOD = new AnniversaryType(1);
    static readonly SINGLE = new AnniversaryType(2);
    static readonly MULTIPLE = new AnniversaryType(3);

    private readonly _value: number;

    private constructor(value: number) {
        this._value = value;
    }

    get value(): number {
        return this._value;
    }

    static fromValue(value: number): AnniversaryType {
        switch (value) {
            case AnniversaryType.PERIOD.value:
                return AnniversaryType.PERIOD;
            case AnniversaryType.SINGLE.value:
                return AnniversaryType.SINGLE;
            case AnniversaryType.MULTIPLE.value:
                return AnniversaryType.MULTIPLE;
            default:
                throw new Error(`Unknown AnniversaryType value: ${value}`);
        }
    }

    static values(): Array<AnniversaryType> {
        return [
            AnniversaryType.PERIOD,
            AnniversaryType.SINGLE,
            AnniversaryType.MULTIPLE
        ];
    }
}
