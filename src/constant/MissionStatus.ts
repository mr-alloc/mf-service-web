import CollectionUtil from "@/utils/CollectionUtil";
import SelectOption from "@/classes/SelectOption";

export default class MissionStatus {

    static readonly CREATED = new MissionStatus(0, "created", "대기", "e0e0e0");
    static readonly IN_PROGRESS = new MissionStatus(1, "in-progress", "진행중", "eddbfb");
    static readonly COMPLETED = new MissionStatus(2, "completed", "완료", "c8ffd4");
    static readonly DELETED = new MissionStatus(3, "deleted", "삭제", "");
    static readonly ALWAYS = new MissionStatus(4, "always", "일정", "fce1e6");

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

    static fromCode(code: number): MissionStatus {
        return MissionStatus.CACHED.get(code) ?? MissionStatus.CREATED;
    }


    static values(): Array<MissionStatus> {
        return [
            MissionStatus.CREATED,
            MissionStatus.IN_PROGRESS,
            MissionStatus.COMPLETED,
            MissionStatus.DELETED,
            MissionStatus.ALWAYS
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

    isNotIn(...others: MissionStatus[]): boolean {
        return others.every(other => other.code !== this.code);
    }

    isIn(...others: MissionStatus[]): boolean {
        return others.some(other => other.code === this.code);
    }


    static toSelectOption(status: MissionStatus): SelectOption {
        return new SelectOption(status.code.toString(), status.name, status.color);
    }


    static NOT_DELETED_FILTER(status: MissionStatus): boolean {
        return status !== MissionStatus.DELETED;
    }

    static fromValue(status: number): MissionStatus {
        return MissionStatus.CACHED.get(status) ?? MissionStatus.CREATED;
    }

}
