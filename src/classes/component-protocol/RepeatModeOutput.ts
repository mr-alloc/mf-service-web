import RepeatOption from "@/constant/RepeatOption";
import type IDatePickerOutput from "@/classes/component-protocol/IDatePickerOuput";
import ScheduleMode from "@/constant/ScheduleMode";

export default class RepeatModeOutput implements IDatePickerOutput {

    private readonly _scheduleMode: ScheduleMode = ScheduleMode.REPEAT;
    private readonly _repeatOption: RepeatOption;
    private _repeatValues: Array<number>;
    private readonly _startTimestamp: number;
    private _scheduleTime: number;
    private readonly _endTimestamp: number;

    constructor(repeatOption: RepeatOption, repeatValue: Array<number>, startTimestamp: number, endTimestamp: number) {
        this._repeatOption = repeatOption;
        this._repeatValues = repeatValue;
        this._startTimestamp = startTimestamp;
        this._scheduleTime = 0;
        this._endTimestamp = endTimestamp;
    }

    get scheduleMode(): ScheduleMode {
        return this._scheduleMode;
    }

    setScheduleTime(scheduleTime: number): void {
        this._scheduleTime = scheduleTime;
    }


    static of(repeatOption: RepeatOption, repeatValue: Array<number>, startTimestamp: number, endTimestamp: number): RepeatModeOutput {
        return new RepeatModeOutput(repeatOption, repeatValue, startTimestamp, endTimestamp);
    }

    toJSON() {
        return {
            scheduleMode: this._scheduleMode.value,
            repeatOption: this._repeatOption.value,
            repeatValues: this._repeatValues,
            startAt: this._startTimestamp,
            scheduleTime: this._scheduleTime,
            endAt: this._endTimestamp
        };
    }
}
