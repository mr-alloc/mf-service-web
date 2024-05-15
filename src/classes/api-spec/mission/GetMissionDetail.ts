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

}
