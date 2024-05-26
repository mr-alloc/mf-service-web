import {defineStore} from "pinia";
import {ref} from "vue";
import type {Moment} from "moment-timezone";
import DateUtil from "@/utils/DateUtil";

export const useCalendarStore = defineStore('calendar', () => {

    const selectedDate = ref('');
    const selectedSecondDate = ref('');

    const startTimestamp = ref(0);
    const endTimestamp = ref(0);
    const isSelected = ref(false);

    function resetSelected() {
        selectedDate.value = '';
        selectedSecondDate.value = '';
        startTimestamp.value = 0;
        endTimestamp.value = 0;
        isSelected.value = false;
    }

    function selectDate(selectedDateValue: Moment) {
        const date = DateUtil.to(selectedDateValue, DateUtil.DEFAULT_DATE_FORMAT);

        const oldFirstDate = selectedDate.value;
        const oldSecondDate = selectedSecondDate.value;
        const oldFirstTimestamp = DateUtil.toUtc(oldFirstDate, DateUtil.DEFAULT_DATE_FORMAT);
        const oldSecondTimestamp = DateUtil.toUtc(oldSecondDate, DateUtil.DEFAULT_DATE_FORMAT);


        //첫번째 날짜를 다시 클릭한 경우
        if (oldFirstDate === date) {
            selectedDate.value = '';
            startTimestamp.value = oldSecondTimestamp;
            endTimestamp.value = 0;

            //기존에 선택한 두번째 날짜가 있다면, 첫번째로 옮긴다.
            if (oldSecondDate !== '') {
                selectedDate.value = oldSecondDate;
                selectedSecondDate.value = '';
            }
            isSelected.value = startTimestamp.value > 0 || endTimestamp.value > 0;
            return;
        }
        //두번째 날짜를 다시 클릭한 경우
        else if (oldSecondDate === date) {
            selectedSecondDate.value = '';
            startTimestamp.value = oldFirstTimestamp;
            endTimestamp.value = 0;

            isSelected.value = startTimestamp.value > 0 || endTimestamp.value > 0;
            return
        }

        if (oldFirstDate === '') {
            selectedDate.value = date;
        } else {
            selectedSecondDate.value = date;
        }

        if (selectedDate.value !== '' || selectedSecondDate.value !== '') {
            const firstUtc = DateUtil.toUtc(selectedDate.value, DateUtil.DEFAULT_DATE_FORMAT);
            const secondUtc = DateUtil.toUtc(selectedSecondDate.value, DateUtil.DEFAULT_DATE_FORMAT);
            if (secondUtc === 0) {
                startTimestamp.value = firstUtc;
            } else if (firstUtc < secondUtc) {
                startTimestamp.value = firstUtc;
                endTimestamp.value = secondUtc;
            } else if (firstUtc > secondUtc) {
                startTimestamp.value = secondUtc;
                endTimestamp.value = firstUtc;
            }

            isSelected.value = true;
        }
    }

    return {
        selectedDate,
        selectedSecondDate,
        selectDate,
        startTimestamp,
        endTimestamp,
        resetSelected,
        isSelected
    }
})
