import RepeatOption from "@/constant/RepeatOption";
import type IDatePickerOutput from "@/classes/component-protocol/IDatePickerOuput";
import ScheduleMode from "@/constant/ScheduleMode";

export default class RepeatModeOutput implements IDatePickerOutput {

    private readonly _scheduleMode: ScheduleMode = ScheduleMode.REPEAT;
    private readonly _repeatOption: RepeatOption;
    private readonly _repeatValue: number;
    private readonly _startTimestamp: number;
    private readonly _endTimestamp: number;

    constructor(repeatOption: RepeatOption, repeatValue: number, startTimestamp: number, endTimestamp: number) {
        this._repeatOption = repeatOption;
        this._repeatValue = repeatValue;
        this._startTimestamp = startTimestamp;
        this._endTimestamp = endTimestamp;
    }

    get scheduleMode(): ScheduleMode {
        return this._scheduleMode;
    }

    static of(repeatOption: RepeatOption, repeatValue: number, startTimestamp: number, endTimestamp: number): RepeatModeOutput {
        return new RepeatModeOutput(repeatOption, repeatValue, startTimestamp, endTimestamp);
    }

    toJSON() {
        const body = {
            scheduleMode: this._scheduleMode.value,
            repeatOption: this._repeatOption.value,
            repeatValue: this._repeatValue,
            startAt: this._startTimestamp,
            endAt: this._endTimestamp
        } as {
            repeatOption: number,
            repeatValue?: number,
            startAt: number,
            endAt: number
        }

        if (this._repeatOption.value === RepeatOption.WEEK.value) {
            body.repeatValue = this._repeatValue;
        }

        return body;
    }
}
