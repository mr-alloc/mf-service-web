export class RequestBody {
    readonly missionId: number
    readonly assignee: number
    readonly title: string | null

    constructor(missionId: number, assignee: number, title: string | null) {
        this.missionId = missionId;
        this.assignee = assignee;
        this.title = title;
    }

    static forAssignee(missionId: number, assignee: number): RequestBody {
        return new RequestBody(missionId, assignee, null);
    }

    static forTitle(missionId: number, title: string): RequestBody {
        return new RequestBody(missionId, 0, title);
    }
}

export class ResponseBody {
    private readonly _assignee: number
    private readonly _title: string

    constructor(assignee: number, title: string) {
        this._assignee = assignee;
        this._title = title;
    }

    get assignee(): number {
        return this._assignee;
    }

    get title(): string {
        return this._title;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(json.assignee, json.title);
    }
}
