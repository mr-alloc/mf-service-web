import MissionDetail from "@/classes/MissionDetail";

export class RequestBody {
    readonly missionId: number;
    readonly type: number | null;
    readonly assignee: number;
    readonly title: string | null;
    readonly status: number | null;

    constructor(missionId: number, type: number | null, assignee: number, title: string | null, status: number | null) {
        this.missionId = missionId;
        this.type = type;
        this.assignee = assignee;
        this.title = title;
        this.status = status;
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
