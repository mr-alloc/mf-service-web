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

    private readonly _type: number;
    private readonly _assignee?: number;
    private readonly _title: string;
    private readonly _status: number;
    private readonly _deadline?: number;

    constructor(type: number, assignee: number, title: string, status: number, deadline: number) {
        this._type = type;
        this._assignee = assignee;
        this._title = title;
        this._status = status
        this._deadline = deadline;
    }

    get type(): number {
        return this._type;
    }

    get assignee(): number | undefined {
        return this._assignee;
    }

    get title(): string {
        return this._title;
    }

    get status(): number {
        return this._status;
    }

    get deadline(): number | undefined {
        return this._deadline;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(json.type, json.assignee, json.title, json.status, json.deadline);
    }
}
