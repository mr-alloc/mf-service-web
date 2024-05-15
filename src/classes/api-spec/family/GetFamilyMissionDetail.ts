export class ResponseBody {
    private readonly _mission: FamilyMissionDetail

    constructor(mission: FamilyMissionDetail) {
        this._mission = mission;
    }

    get mission(): FamilyMissionDetail {
        return this._mission;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(FamilyMissionDetail.fromJson(json.mission));
    }
}


export class FamilyMissionDetail {
    private readonly _id: number;
    private readonly _title: string;
    private readonly _type: string;
    private readonly _status: number;
    private readonly _assignee: number;
    private readonly _reporter: string;

    constructor(id: number, title: string, type: string, status: number, assignee: number, reporter: string) {
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

    get reporter(): string {
        return this._reporter;
    }

    static fromJson(json: any): FamilyMissionDetail {
        return new FamilyMissionDetail(json.id, json.title, json.type, json.status, json.assignee, json.reporter);
    }
}
