import type IDatePickerOutput from "@/classes/component-protocol/IDatePickerOuput";
import ScheduleMode from "@/constant/ScheduleMode";

export default class PeriodModeOutput implements IDatePickerOutput {

    private readonly _scheduleMode: ScheduleMode = ScheduleMode.PERIOD
    private readonly _startTimestamp: number;
    private _scheduleTime: number;
    private readonly _endTimestamp: number;

    constructor(startTimestamp: number, endTimestamp: number) {
        this._startTimestamp = startTimestamp;
        this._endTimestamp = endTimestamp;
        this._scheduleTime = 0;
    }

    get startTimestamp(): number {
        return this._startTimestamp;
    }

    get endTimestamp(): number {
        return this._endTimestamp;
    }

    get scheduleMode(): ScheduleMode {
        return this._scheduleMode;
    }

    setScheduleTime(scheduleTime: number): void {
        this._scheduleTime = scheduleTime;
    }


    toJSON() {
        return {
            scheduleMode: this._scheduleMode.value,
            startAt: this._startTimestamp,
            scheduleTime: this._scheduleTime,
            endAt: this._endTimestamp
        };
    }
}
