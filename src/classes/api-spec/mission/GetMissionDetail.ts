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
    private readonly _name: string;
    private readonly _type: number;
    private readonly _status: number;
    private readonly _reporter: number;
    private readonly _remainSeconds: number;
    private readonly _assignee?: number;
    private readonly _deadline?: number;

    constructor(id: number, name: string, type: number, status: number, reporter: number, remainSeconds: number, assignee?: number, deadline?: number) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._status = status;
        this._reporter = reporter;
        this._remainSeconds = remainSeconds;
        this._assignee = assignee;
        this._deadline = deadline;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get type(): number {
        return this._type;
    }

    get status(): number {
        return this._status;
    }

    get reporter(): number {
        return this._reporter;
    }

    get remainSeconds(): number {
        return this._remainSeconds;
    }

    get assignee(): number | undefined {
        return this._assignee;
    }

    get deadline(): number | undefined {
        return this._deadline;
    }

    static fromJson(json: any): MissionDetail {
        return new MissionDetail(json.id, json.name, json.type, json.status, json.reporter, json.remainSeconds, json.assignee, json.deadline);
    }
}

