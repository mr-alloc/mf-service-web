export class RequestBody {
    readonly missionId: number;

    constructor(missionId: number) {
        this.missionId = missionId;
    }

    static of(missionId: any) {
        return new RequestBody(missionId);
    }
}

export class ResponseBody {
    private readonly _mission: MissionDetail;

    constructor(mission: MissionDetail) {
        this._mission = mission;
    }

    get mission(): MissionDetail {
        return this._mission;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(MissionDetail.fromJson(json.mission));
    }
}

export class MissionDetail {
    private readonly _id: number;
    private readonly _title: string;
    private readonly _type: string;
    private readonly _status: number;
    private readonly _assignee: number;
    private readonly _reporter: number;

    constructor(id: number, title: string, type: string, status: number, assignee: number, reporter: number) {
        this._id = id;
        this._title = title;
        this._type = type;
        this._status = status;
        this._assignee = assignee;
        this._reporter = reporter;
    }

    get id(): number {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get type(): string {
        return this._type;
    }

    get status(): number {
        return this._status;
    }

    get assignee(): number {
        return this._assignee;
    }

    get reporter(): number {
        return this._reporter;
    }

    static fromJson(json: any): MissionDetail {
        return new MissionDetail(json.id, json.title, json.type.toString(), json.status, json.assignee, json.reporter);
    }
}
