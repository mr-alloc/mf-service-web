import type IDatePickerOutput from "@/classes/component-protocol/IDatePickerOuput";
import ScheduleMode from "@/constant/ScheduleMode";

export default class MultipleModeOutput implements IDatePickerOutput {

    private readonly _scheduleMode = ScheduleMode.MULTIPLE;
    private readonly _selectedTimestamps: Set<number>;

    constructor(selectedTimestamps: Set<number>) {
        this._selectedTimestamps = selectedTimestamps;
    }

    get selectedTimestamps(): Set<number> {
        return this._selectedTimestamps;
    }

    get scheduleMode(): ScheduleMode {
        return this._scheduleMode;
    }

    toJSON() {
        return {
            scheduleMode: this._scheduleMode.value,
            selected: Array.from(this._selectedTimestamps)
        }
    }
}
