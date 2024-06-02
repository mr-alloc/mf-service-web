import SelectOption from "@/classes/SelectOption";
import CollectionUtil from "@/utils/CollectionUtil";

export default class RepeatOption {

    static readonly NONE = new RepeatOption(-1, "없음");
    static readonly WEEK = new RepeatOption(0, "매주");
    static readonly MONTH = new RepeatOption(1, "매월");
    static readonly YEAR = new RepeatOption(2, "매년");

    private static readonly CACHED = CollectionUtil.toMap(RepeatOption.values(), option => option.value);

    private readonly _value: number;
    private readonly _alias: string;

    private constructor(value: number, alias: string) {
        this._value = value;
        this._alias = alias;
    }

    get value(): number {
        return this._value;
    }

    get alias(): string {
        return this._alias;
    }

    is(option: RepeatOption) {
        return this._value === option.value;
    }

    static values(): RepeatOption[] {
        return [
            RepeatOption.WEEK,
            RepeatOption.MONTH,
            RepeatOption.YEAR
        ];
    }

    static selectOptions(): Array<SelectOption> {
        return RepeatOption.values().map(option => new SelectOption(String(option.value), option.alias));
    }

    static fromValue(number: number) {
        return RepeatOption.CACHED.get(number) ?? RepeatOption.NONE;
    }
}
