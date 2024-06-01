import {defineStore} from "pinia";
import {ref} from "vue";
import type {Moment} from "moment-timezone";
import DateUtil from "@/utils/DateUtil";
import {
    CalendarHoliday,
    CalendarMission,
    FamilyMission,
    type IMission,
    RequestBody,
    ResponseBody
} from "@/classes/api-spec/mission/GetMemberCalendar";
import AnniversaryValue from "@/classes/api-spec/AnniversaryValue";
import CalendarAnniversary from "@/classes/CalendarAnniversary";
import {call} from "@/utils/NetworkUtil";
import Mission from "@/constant/api-meta/Mission";
import {hasSelectedFamilyId} from "@/utils/LocalCache";
import CollectionUtil from "@/utils/CollectionUtil";
import * as GetAnniversaries from "@/classes/api-spec/GetAnniversaries";
import Anniversary from "@/constant/api-meta/Anniversary";

export const useCalendarStore = defineStore('calendar', () => {

    const selectedDate = ref('');
    const selectedSecondDate = ref('');

    const startTimestamp = ref(0);
    const endTimestamp = ref(0);
    const isSelected = ref(false);
    const memberCalendarMap = ref<Map<string, Array<IMission>>>(new Map<string, Array<IMission>>());
    const holidaysMap = ref<Map<string, CalendarHoliday>>(new Map<string, CalendarHoliday>());
    const anniversaryMap = ref<Map<string, Array<CalendarAnniversary>>>(new Map<string, Array<CalendarAnniversary>>());

    function resetSelected() {
        selectedDate.value = '';
        selectedSecondDate.value = '';
        startTimestamp.value = 0;
        endTimestamp.value = 0;
        isSelected.value = false;
    }

    async function fetchOwnCalendar(startDate: Moment, endDate: Moment) {
        await call<RequestBody, ResponseBody>(Mission.GetMemberCalendar, new RequestBody(startDate, endDate),
            (res) => {
                const responseBody = ResponseBody.fromJson(res.data, (mission) => {
                    return hasSelectedFamilyId()
                        ? FamilyMission.fromJson(mission)
                        : CalendarMission.fromJson(mission)
                });
                //일정
                memberCalendarMap.value = CollectionUtil.groupBy<string, IMission>(
                    responseBody.calendar,
                    (mission) => mission.groupingDate
                );
                //공휴일
                holidaysMap.value = CollectionUtil.toMap<string, CalendarHoliday>(
                    responseBody.holidays.filter(h => !h.isLunar),
                    (holiday) => holiday.date,
                );
            },
            (spec, error) => {
                console.log(error);
            });
    }


    async function fetchOwnAnniversaries(month: Moment) {
        await call<any, GetAnniversaries.ResponseBody>(
            Anniversary.GetAnniversaries,
            {yearMonth: month.format(DateUtil.YYYYMM)},
            (response) => {
                const responseBody = GetAnniversaries.ResponseBody.fromJson(response.data);

                //기념일
                anniversaryMap.value = new Map();
                responseBody.anniversaries.forEach(addAnniversary);
            });
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

    function addAnniversary(value: AnniversaryValue) {
        const anniversaries = CalendarAnniversary.of(value);
        anniversaries.forEach((anniversary) => {
            const date = anniversary.date;
            if (anniversaryMap.value.has(date)) {
                const anniversaries = anniversaryMap.value.get(date);
                if (anniversaries) {
                    anniversaries.push(anniversary);
                }
            } else {
                anniversaryMap.value.set(date, [anniversary]);
            }
        });
    }

    return {
        selectedDate,
        selectedSecondDate,
        selectDate,
        startTimestamp,
        endTimestamp,
        resetSelected,
        isSelected,
        fetchOwnCalendar,
        addAnniversary,
        memberCalendarMap,
        holidaysMap,
        anniversaryMap,
        fetchOwnAnniversaries
    }
})
