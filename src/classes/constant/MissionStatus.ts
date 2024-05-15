import CollectionUtil from "@/utils/CollectionUtil";

export default class MissionStatus {

    static readonly CREATED = new MissionStatus(0);
    static readonly IN_PROGRESS = new MissionStatus(1);
    static readonly COMPLETED = new MissionStatus(2);
    static readonly PAUSED = new MissionStatus(3);
    static readonly DELETED = new MissionStatus(4);

    static readonly CACHED = CollectionUtil.toMap(MissionStatus.values(), (status) => status.code);


    private readonly _code: number;

    constructor(code: number) {
        this._code = code;
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

}
