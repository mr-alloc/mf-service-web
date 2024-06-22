export default class MissionState {

    private readonly _id: number;
    private readonly _missionId: number;
    private readonly _status: number;
    private readonly _startAt: number;
    private readonly _endAt: number;

    constructor(id: number, missionId: number, status: number, startAt: number, endAt: number) {
        this._id = id;
        this._missionId = missionId;
        this._status = status;
        this._startAt = startAt;
        this._endAt = endAt;
    }

    get id(): number {
        return this._id;
    }

    get missionId(): number {
        return this._missionId;
    }

    get status(): number {
        return this._status;
    }

    get startAt(): number {
        return this._startAt;
    }

    get endAt(): number {
        return this._endAt;
    }

    static fromJson(json: any): MissionState {
        return new MissionState(
            json.id,
            json.missionId,
            json.status,
            json.startAt,
            json.endAt
        );
    }
}
