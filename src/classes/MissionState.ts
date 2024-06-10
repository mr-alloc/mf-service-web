export default class MissionState {

    private readonly _missionId: number;
    private readonly _status: number;
    private readonly _startAt: number;
    private readonly _endAt: number;

    constructor(missionId: number, status: number, startAt: number, endAt: number) {
        this._missionId = missionId;
        this._status = status;
        this._startAt = startAt;
        this._endAt = endAt;
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
            json.missionId,
            json.status,
            json.startAt,
            json.endAt
        );
    }
}
