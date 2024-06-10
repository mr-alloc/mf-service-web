import MissionDetail from "@/classes/MissionDetail";

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


