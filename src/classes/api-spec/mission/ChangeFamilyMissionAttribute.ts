export class RequestBody {
    readonly missionId: number
    readonly assignee: number
    readonly title: string | null
    readonly status: number | null

    constructor(missionId: number, assignee: number, title: string | null, status: number | null) {
        this.missionId = missionId;
        this.assignee = assignee;
        this.title = title;
        this.status = status;
    }

    static forAssignee(missionId: number, assignee: number): RequestBody {
        return new RequestBody(missionId, assignee, null, null);
    }

    static forTitle(missionId: number, title: string): RequestBody {
        return new RequestBody(missionId, 0, title, null);
    }

    static forStatus(missionId: number, status: number) {
        return new RequestBody(missionId, 0, null, status);
    }
}

export class ResponseBody {
    private readonly _assignee: number
    private readonly _title: string
    private readonly _status: number

    constructor(assignee: number, title: string, status: number) {
        this._assignee = assignee;
        this._title = title;
        this._status = status
    }

    get assignee(): number {
        return this._assignee;
    }

    get title(): string {
        return this._title;
    }

    get status(): number {
        return this._status;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(json.assignee, json.title, json.status);
    }
}
