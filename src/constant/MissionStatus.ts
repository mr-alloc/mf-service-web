import CollectionUtil from "@/utils/CollectionUtil";

export default class MissionStatus {

    static readonly CREATED = new MissionStatus(0, "created", "대기");
    static readonly IN_PROGRESS = new MissionStatus(1, "in-progress", "진행중");
    static readonly COMPLETED = new MissionStatus(2, "completed", "완료");
    static readonly PAUSED = new MissionStatus(3, "paused", "정지");
    static readonly DELETED = new MissionStatus(4, "deleted", "삭제");

    static readonly CACHED = CollectionUtil.toMap(MissionStatus.values(), (status) => status.code);


    private readonly _code: number;
    private readonly _simpleName: string;
    private readonly _name: string;

    constructor(code: number, simpleName: string, name: string) {
        this._code = code;
        this._simpleName = simpleName;
        this._name = name;
    }

    static fromCode(code: number): MissionStatus | undefined {
        return MissionStatus.CACHED.get(code);
    }


    static values(): Array<MissionStatus> {
        return [
            MissionStatus.CREATED,
            MissionStatus.IN_PROGRESS,
            MissionStatus.COMPLETED,
            MissionStatus.PAUSED,
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
}
