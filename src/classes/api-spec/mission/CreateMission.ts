import type IDatePickerOutput from "@/classes/component-protocol/IDatePickerOuput";

export class RequestBody {

    private readonly _name: string;
    private readonly _subName: string;
    private readonly _assignee: number;
    private readonly _type: number;
    private readonly _deadline?: number;
    private readonly _scheduleInfo: IDatePickerOutput;

    constructor(name: string, subName: string, assignee: number, type: number, scheduleInfo: IDatePickerOutput, deadline?: number) {
        this._name = name;
        this._subName = subName;
        this._assignee = assignee;
        this._type = type;
        this._deadline = deadline;
        this._scheduleInfo = scheduleInfo;
    }

    toJSON() {
        const body = {
            name: this._name,
            subName: this._subName,
            assignee: this._assignee,
            type: this._type,
            scheduleInfo: this._scheduleInfo
        } as {
            name: string,
            subName: string,
            assignee: number,
            type: number,
            scheduleInfo: IDatePickerOutput,
            deadline?: number
        }

        this._deadline && (body.deadline = this._deadline);

        return body;
    }

    public toString() {
        return JSON.stringify(this, null, 2);
    }
}
