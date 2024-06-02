import CollectionUtil from "@/utils/CollectionUtil";
import SelectOption from "@/classes/SelectOption";

export default class DayOfWeek {

    static readonly MONDAY = new DayOfWeek(1, "월", "월요일");
    static readonly TUESDAY = new DayOfWeek(2, "화", "화요일");
    static readonly WEDNESDAY = new DayOfWeek(3, "수", "수요일");
    static readonly THURSDAY = new DayOfWeek(4, "목", "목요일");
    static readonly FRIDAY = new DayOfWeek(5, "금", "금요일");
    static readonly SATURDAY = new DayOfWeek(6, "토", "토요일");
    static readonly SUNDAY = new DayOfWeek(7, "일", "일요일");

    private static readonly CACHED = CollectionUtil.toMap(DayOfWeek.values(), (dayOfWeek) => dayOfWeek.value);

    private readonly _value: number;
    private readonly _alias: string;
    private readonly _name: string;

    private constructor(value: number, alias: string, name: string) {
        this._value = value;
        this._alias = alias;
        this._name = name;
    }

    get value(): number {
        return this._value;
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
