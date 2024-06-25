import type MissionComment from "@/classes/api-spec/MissionComment";

export default class UserComments {

    private readonly _memberId: number;
    private readonly _minuteAsSecond: number;
    private readonly _comments: Array<MissionComment>;

    constructor(memberId: number, minuteAsSecond: number, comments: Array<MissionComment>) {
        this._memberId = memberId;
        this._minuteAsSecond = minuteAsSecond;
        this._comments = comments;
    }

    get memberId(): number {
        return this._memberId;
    }

    get minuteAsSecond(): number {
        return this._minuteAsSecond;
    }

    get comments(): Array<MissionComment> {
        return this._comments;
    }
}
