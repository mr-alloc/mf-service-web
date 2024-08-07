import CollectionUtil from "@/utils/CollectionUtil";
import SelectOption from "@/classes/SelectOption";

export default class MissionType {

    public static readonly NONE = new MissionType(-1, '', '');
    public static readonly SCHEDULE = new MissionType(0, '일정', 'schedule');
    public static readonly MISSION = new MissionType(1, '일반미션', 'mission');
    // static readonly PACKAGE = new MissionType(2, '미션팩');
    // static readonly STEP = new MissionType(3, '단계미션');

    private static readonly CACHED = CollectionUtil.toMap(MissionType.values(), (type) => type.value);
    static readonly toSelectOption = (type: MissionType) => new SelectOption(type.value.toString(), type.name);
    private readonly _value: number;
    private readonly _name: string;
    private readonly _simpleName: string

    private constructor(value: number, name: string, simpleName: string) {
        this._value = value;
        this._name = name;
        this._simpleName = simpleName
    }

    get value(): number {
        return this._value;
    }

    get name(): string {
        return this._name;
    }

    get simpleName(): string {
        return this._simpleName;
    }

    isIn(...others: MissionType[]) {
        return others.some(other => other.value === this.value);
    }

    isNotIn(...others: MissionType[]) {
        return others.every(other => other.value !== this.value);
    }

    static fromValue(value: number): MissionType {
        return MissionType.CACHED.get(value) ?? MissionType.NONE;
    }

    static values(): MissionType[] {
        return [
            MissionType.SCHEDULE,
            MissionType.MISSION,
            // MissionType.PACKAGE,
            // MissionType.STEP
        ];
    }


}
