import type ScheduleMode from "@/constant/ScheduleMode";

export default interface IDatePickerOutput {

    get scheduleMode(): ScheduleMode

    applyToEachSelected(callback: (each: number) => number): void;
}


