import type IDatePickerOutput from "@/classes/component-protocol/IDatePickerOuput";
import ScheduleMode from "@/constant/ScheduleMode";

export default class PeriodModeOutput implements IDatePickerOutput {

    private readonly _scheduleMode: ScheduleMode = ScheduleMode.PERIOD
    private _startTimestamp: number;
    private readonly _endTimestamp: number;

    constructor(startTimestamp: number, endTimestamp: number) {
        this._startTimestamp = startTimestamp;
        this._endTimestamp = endTimestamp;
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

    applyToEachSelected(callback: (each: number) => number): void {
        this._startTimestamp = callback(this._startTimestamp);
    }

    toJSON() {
        return {
            scheduleMode: this._scheduleMode.value,
            startAt: this._startTimestamp,
            endAt: this._endTimestamp
        };
    }
}
