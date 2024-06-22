import type ScheduleMode from "@/constant/ScheduleMode";

export default interface IDatePickerOutput {

    get scheduleMode(): ScheduleMode

    setScheduleTime(scheduleTime: number): void;
}


