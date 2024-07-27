import MissionDetail from "@/classes/MissionDetail";

export class RequestBody {
    private readonly _stateId: number | null;
    private readonly _missionId: number;
    private readonly _type: number | null;
    private readonly _assignee: number;
    private readonly _title: string | null;
    private readonly _status: number | null;
    private readonly _startStamp: number | null;

    constructor(
      stateId: number | null,
      missionId: number,
      type: number | null,
      assignee: number,
      title: string | null,
      status: number | null,
      startStamp: number | null
    ) {
        this._stateId = stateId;
        this._missionId = missionId;
        this._type = type;
        this._assignee = assignee;
        this._title = title;
        this._status = status;
        this._startStamp = startStamp;
    }

    static forAssignee(missionId: number, assignee: number): RequestBody {
        return new RequestBody(null, missionId, null, assignee, null, null, null);
    }

    static forTitle(missionId: number, title: string): RequestBody {
        return new RequestBody(null, missionId, null, 0, title, null, null);
    }

    static forStatus(stateId: number | null, missionId: number, status: number, startStamp: number) {
        return new RequestBody(stateId, missionId, null, 0, null, status, startStamp);
    }

    static forName(missionId: number, title: string) {
        return new RequestBody(null, missionId, null, 0, title, null, null);
    }

    static forType(missionId: number, type: number) {
        return new RequestBody(null, missionId, type, 0, null, null, null);
    }

    toJSON() {
        return {
            stateId: this._stateId,
            missionId: this._missionId,
            type: this._type,
            assignee: this._assignee,
            title: this._title,
            status: this._status,
            startStamp: this._startStamp
        };
    }
}

export class ResponseBody {

    private readonly _changed: MissionDetail;

    constructor(changed: MissionDetail) {
        this._changed = changed;
    }

    get changed(): MissionDetail {
        return this._changed;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(MissionDetail.fromJson(json.changed));
    }
}
