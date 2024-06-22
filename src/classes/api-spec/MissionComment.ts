export default class MissionComment {

    private readonly _id: number;
    private readonly _memberId: number;
    private readonly _content: string;
    private readonly _createdAt: number;

    constructor(id: number, memberId: number, content: string, createdAt: number) {
        this._id = id;
        this._memberId = memberId;
        this._content = content;
        this._createdAt = createdAt;
    }

    get id(): number {
        return this._id;
    }

    get memberId(): number {
        return this._memberId;
    }

    get content(): string {
        return this._content;
    }

    get createdAt(): number {
        return this._createdAt;
    }

    public static fromJson(json: any): MissionComment {
        return new MissionComment(json.id, json.memberId, json.content, json.createdAt);
    }
}
