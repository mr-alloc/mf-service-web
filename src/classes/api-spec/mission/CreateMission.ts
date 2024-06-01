export class RequestBody {
    private readonly _name: string;
    private readonly _subName: string;
    private readonly _assignee: number;
    private readonly _type: number;
    private readonly _startDueStamp: number;
    private readonly _deadline?: number;
    private readonly _endDueStamp?: number;

    constructor(name: string, subName: string, assignee: number, type: number, startDueStamp: number, deadline: number) {
        this._name = name;
        this._subName = subName;
        this._assignee = assignee;
        this._type = type;
        this._startDueStamp = startDueStamp;
        this._deadline = deadline;
    }

    toJSON() {
        return {
            name: this._name,
            subName: this._subName,
            assignee: this._assignee,
            type: this._type,
            startTime: this._startDueStamp,
            deadline: this._deadline
        }
    }

    static forSingleDay(type: number, assignee: number, missionTitle: string, missionContent: string, startDueStamp: number, deadline: number) {
        return new RequestBody(missionTitle, missionContent, assignee, type, startDueStamp, deadline);
    }
}
