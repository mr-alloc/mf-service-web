import CollectionUtil from "@/utils/CollectionUtil";
import SelectOption from "@/classes/SelectOption";

export default class MissionType {

    static readonly NONE = new MissionType(-1, '');
    static readonly SCHEDULE = new MissionType(0, '일정');
    static readonly MISSION = new MissionType(1, '일반미션');
    // static readonly PACKAGE = new MissionType(2, '미션팩');
    // static readonly STEP = new MissionType(3, '단계미션');

    private static readonly CACHED = CollectionUtil.toMap(MissionType.values(), (type) => type.value);
    static readonly toSelectOption = (type: MissionType) => new SelectOption(type.value.toString(), type.name);
    private readonly _value: number;
    private readonly _name: string;

    private constructor(value: number, name: string) {
        this._value = value;
        this._name = name;
    }

    get value(): number {
        return this._value;
    }

    get name(): string {
        return this._name;
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
