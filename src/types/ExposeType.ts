import type ScheduleMode from "@/constant/ScheduleMode";
import type IDatePickerOutput from "@/classes/component-protocol/IDatePickerOuput";
import type SelectOption from "@/classes/SelectOption";

export type BlinkInputExpose = {
    value: string;
    input: HTMLInputElement;
}

export type DatePickerExpose = {
    scheduleMode: ScheduleMode,
    extractResult: () => IDatePickerOutput
}

export type GroupButtonExpose = {
    resetValues: () => void,
    selected: SelectOption
}
