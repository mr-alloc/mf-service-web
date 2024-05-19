import CollectionUtil from "@/utils/CollectionUtil";
import SelectOption from "@/classes/SelectOption";

export default class MissionStatus {

    static readonly CREATED = new MissionStatus(0, "created", "대기", "e0e0e0");
    static readonly IN_PROGRESS = new MissionStatus(1, "in-progress", "진행중", "eddbfb");
    static readonly COMPLETED = new MissionStatus(2, "completed", "완료", "c8ffd4");
    static readonly DELETED = new MissionStatus(3, "deleted", "삭제", "");

    private static readonly CACHED = CollectionUtil.toMap(MissionStatus.values(), (status) => status.code);


    private readonly _code: number;
    private readonly _simpleName: string;
    private readonly _name: string;
    private readonly _color: string;

    constructor(code: number, simpleName: string, name: string, color: string) {
        this._code = code;
        this._simpleName = simpleName;
        this._name = name;
        this._color = color;
    }

    static fromCode(code: number): MissionStatus | undefined {
        return MissionStatus.CACHED.get(code);
    }


    static values(): Array<MissionStatus> {
        return [
            MissionStatus.CREATED,
            MissionStatus.IN_PROGRESS,
            MissionStatus.COMPLETED,
            MissionStatus.DELETED
        ];
    }

    get code(): number {
        return this._code;
    }

    get simpleName(): string {
        return this._simpleName;
    }

    get name(): string {
        return this._name;
    }

    get color(): string {
        return this._color;
    }

    static toSelectOption(status: MissionStatus): SelectOption {
        return new SelectOption(status.code.toString(), status.name, status.color);
    }
}
