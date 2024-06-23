import MissionDetail from "@/classes/MissionDetail";

export class RequestBody {
    readonly _missionId: number;
    readonly _type: number | null;
    readonly _assignee: number;
    readonly _title: string | null;
    readonly _status: number | null;

    constructor(missionId: number, type: number | null, assignee: number, title: string | null, status: number | null) {
        this._missionId = missionId;
        this._type = type;
        this._assignee = assignee;
        this._title = title;
        this._status = status;
    }

    static forAssignee(missionId: number, assignee: number): RequestBody {
        return new RequestBody(missionId, null, assignee, null, null);
    }

    static forTitle(missionId: number, title: string): RequestBody {
        return new RequestBody(missionId, null, 0, title, null);
    }

    static forStatus(missionId: number, status: number) {
        return new RequestBody(missionId, null, 0, null, status);
    }

    static forName(missionId: number, title: string) {
        return new RequestBody(missionId, null, 0, title, null);
    }

    static forType(missionId: number, type: number) {
        return new RequestBody(missionId, type, 0, null, null);
    }

    toJSON() {
        return {
            missionId: this._missionId,
            type: this._type,
            assignee: this._assignee,
            title: this._title,
            status: this._status
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
