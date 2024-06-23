import CalendarDate from "@/classes/CalendarDate";

export default class MissionComment {

    private readonly _id: number;
    private readonly _memberId: number;
    private readonly _content: string;
    private readonly _createdAt: CalendarDate;

    constructor(id: number, memberId: number, content: string, createdAt: number) {
        this._id = id;
        this._memberId = memberId;
        this._content = content;
        this._createdAt = new CalendarDate(createdAt);
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

    get createdAt(): CalendarDate {
        return this._createdAt;
    }

    public static fromJson(json: any): MissionComment {
        return new MissionComment(json.id, json.memberId, json.content, json.createdAt);
    }
}
