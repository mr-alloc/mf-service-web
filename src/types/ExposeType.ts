import type ScheduleMode from "@/constant/ScheduleMode";
import type IDatePickerOutput from "@/classes/component-protocol/IDatePickerOuput";
import type SelectOption from "@/classes/SelectOption";

export type BlinkInputExpose = {
    value: string;
    input: HTMLInputElement;
}

export type DatePickerExpose = {
    getScheduleMode: () => ScheduleMode,
    extractResult: () => IDatePickerOutput
}

export type GroupButtonExpose = {
    resetValues: () => void,
    selected: SelectOption
}

export type TemporalUnitIndicatorExpose = {
    calculate: (value: number) => void
}

export type TimePickerExpose = {
    getValue: () => number,
}

export type GetStringValueExpose = {
    getValue: () => string,
    getInput: () => HTMLTextAreaElement
}
