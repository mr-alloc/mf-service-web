import CollectionUtil from "@/utils/CollectionUtil";
import SelectOption from "@/classes/SelectOption";

export default class DayOfWeek {

    static readonly MONDAY = new DayOfWeek(1, 1, "월", "월요일");
    static readonly TUESDAY = new DayOfWeek(2, 2, "화", "화요일");
    static readonly WEDNESDAY = new DayOfWeek(3, 3, "수", "수요일");
    static readonly THURSDAY = new DayOfWeek(4, 4, "목", "목요일");
    static readonly FRIDAY = new DayOfWeek(5, 5, "금", "금요일");
    static readonly SATURDAY = new DayOfWeek(6, 6, "토", "토요일");
    static readonly SUNDAY = new DayOfWeek(7, 0, "일", "일요일");

    private static readonly CACHED = CollectionUtil.toMap(DayOfWeek.values(), (dayOfWeek) => dayOfWeek.value);
    private static readonly CACHED_SUNDAY_START = CollectionUtil.toMap(DayOfWeek.values(), (dayOfWeek) => dayOfWeek.sundayStartValue);

    private readonly _value: number;
    private readonly _sundayStartValue: number;
    private readonly _alias: string;
    private readonly _name: string;

    private constructor(value: number, sundayStartValue: number, alias: string, name: string) {
        this._value = value;
        this._sundayStartValue = sundayStartValue;
        this._alias = alias;
        this._name = name;
    }

    get value(): number {
        return this._value;
    }

    get sundayStartValue(): number {
        return this._sundayStartValue;
    }

    get alias(): string {
        return this._alias;
    }

    get name(): string {
        return this._name;
    }

    static fromValue(value: number): DayOfWeek | undefined {
        return this.CACHED.get(value);
    }

    static fromSundayStartValue(value: number): DayOfWeek | undefined {
        return this.CACHED_SUNDAY_START.get(value);
    }

    static values(): DayOfWeek[] {
        return [
            DayOfWeek.SUNDAY,
            DayOfWeek.MONDAY,
            DayOfWeek.TUESDAY,
            DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY,
            DayOfWeek.FRIDAY,
            DayOfWeek.SATURDAY
        ];
    }

    static selectOptions(): Array<SelectOption> {
        return DayOfWeek.values().map(dayOfWeek => new SelectOption(String(dayOfWeek.value), dayOfWeek.alias));
    }
}
