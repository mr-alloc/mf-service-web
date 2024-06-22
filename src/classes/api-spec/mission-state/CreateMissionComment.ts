import MissionComment from "@/classes/api-spec/MissionComment";

export class RequestBody {

    private readonly _stateId: number;
    private readonly _missionId: number;
    private readonly _content: string;
    private readonly _timestamp: number;

    constructor(stateId: number, missionId: number, content: string, timestamp: number) {
        this._stateId = stateId;
        this._missionId = missionId;
        this._content = content;
        this._timestamp = timestamp;
    }

    get stateId(): number {
        return this._stateId;
    }

    get missionId(): number {
        return this._missionId;
    }

    get content(): string {
        return this._content;
    }

    get timestamp(): number {
        return this._timestamp;
    }

    public static of(stateId: number, missionId: number, content: string, timestamp: number): RequestBody {
        return new RequestBody(stateId, missionId, content, timestamp);
    }

    toJSON() {
        return {
            stateId: this._stateId,
            missionId: this._missionId,
            content: this._content,
            timestamp: this._timestamp
        };
    }
}

export class ResponseBody {

    private readonly _created: MissionComment;

    constructor(created: MissionComment) {
        this._created = created;
    }

    get created(): MissionComment {
        return this._created;
    }

    public static fromJson(json: any): ResponseBody {
        return new ResponseBody(MissionComment.fromJson(json.created));
    }
}
