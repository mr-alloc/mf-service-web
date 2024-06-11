import {defineStore} from "pinia";
import {ref} from "vue";
import type {Moment} from "moment-timezone";
import DateUtil from "@/utils/DateUtil";
import {CalendarHoliday, type IMission, RequestBody, ResponseBody} from "@/classes/api-spec/mission/GetMemberCalendar";
import AnniversaryValue from "@/classes/api-spec/AnniversaryValue";
import CalendarAnniversary from "@/classes/CalendarAnniversary";
import {call} from "@/utils/NetworkUtil";
import Mission from "@/constant/api-meta/Mission";
import CollectionUtil from "@/utils/CollectionUtil";
import * as GetAnniversaries from "@/classes/api-spec/GetAnniversaries";
import Anniversary from "@/constant/api-meta/Anniversary";
import CalendarDate from "@/classes/CalendarDate";
import TemporalUtil from "@/utils/TemporalUtil";
import type MissionDetail from "@/classes/MissionDetail";
import CalendarMission from "@/classes/CalendarMission";

export const useCalendarStore = defineStore('calendar', () => {

    const timestamp = ref(0);
    const memberCalendarMap = ref<Map<string, Array<IMission>>>(new Map<string, Array<IMission>>());
    const holidaysMap = ref<Map<string, CalendarHoliday>>(new Map<string, CalendarHoliday>());
    const anniversaryMap = ref<Map<string, Array<CalendarAnniversary>>>(new Map<string, Array<CalendarAnniversary>>());

    const calendar = ref<Array<CalendarDate>>([]);
    const startOfCalendar = ref<number>(0);
    const endOfCalendar = ref<number>(0);

    function resetSelected() {
        timestamp.value = 0;
    }

    function initCalendar(localMonth: Moment) {
        calendar.value = DateUtil.getCalendarDays(localMonth, (sc, sm, em, ec) => {
            startOfCalendar.value = TemporalUtil.toUnix(sc.unix());
            endOfCalendar.value = TemporalUtil.toUnix(ec.unix());
        });
    }

    async function fetchOwnCalendar(soc?: number, eoc?: number) {
        startOfCalendar.value = soc ?? startOfCalendar.value;
        endOfCalendar.value = eoc ?? endOfCalendar.value;

        await call<RequestBody, ResponseBody>(Mission.GetMemberCalendar, new RequestBody(soc ?? startOfCalendar.value, eoc ?? endOfCalendar.value),
            (res) => {
                const responseBody = ResponseBody.fromJson(res.data);
                //일정
                addMissions(responseBody.calendar);

                //공휴일
                holidaysMap.value = CollectionUtil.toMap<string, CalendarHoliday>(
                    responseBody.holidays.filter(h => !h.isLunar),
                    (holiday) => holiday.date,
                );
            });
    }


    async function fetchOwnAnniversaries() {
        await call<RequestBody, GetAnniversaries.ResponseBody>(
            Anniversary.GetAnniversaries, new RequestBody(startOfCalendar.value, endOfCalendar.value),
            (response) => {
                const responseBody = GetAnniversaries.ResponseBody.fromJson(response.data);

                //기념일
                anniversaryMap.value = new Map();
                responseBody.anniversaries.forEach((anniversary) => {
                    addAnniversary(anniversary);
                });
            });
    }


    function selectDate(selectedDay: CalendarDate) {
        //재클릭시 초기화
        if (selectedDay.timestamp === timestamp.value) {
            resetSelected();
            return;
        }
        timestamp.value = selectedDay.timestamp;
    }

    function addAnniversary(value: AnniversaryValue) {
        const anniversaries = CalendarAnniversary.of(value, startOfCalendar.value, endOfCalendar.value);
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

    function addMissions(details: Array<MissionDetail>) {
        const missions = details.flatMap((detail) => CalendarMission.of(
            detail,
            startOfCalendar.value,
            endOfCalendar.value
        ));

        // missions.forEach((mission) => {
        //     console.log(mission.toString());
        // });

        // missions.forEach((mission) => {
        //     console.log(mission.toString());
        // });
        const weeksMap = new Map<number, Array<CalendarMission>>();
        DateUtil.forEachWeek(startOfCalendar.value, endOfCalendar.value, (week, start, end) => {
            missions.forEach((mission) => {
                if (mission.startAt <= end && mission.endAt >= start) {
                    if (weeksMap.has(week)) {
                        const missions = weeksMap.get(week);
                        if (missions) {
                            missions.push(mission);
                        }
                    } else {
                        weeksMap.set(week, [mission]);
                    }
                }
            })
        });

        weeksMap.forEach((missions, week) => {
            console.log(`week: ${week}`);
            missions.forEach((mission) => {
                console.log(mission.toString());
            });
        });
    }

    return {
        timestamp,
        selectDate,
        resetSelected,
        initCalendar,
        fetchOwnCalendar,
        addAnniversary,
        memberCalendarMap,
        holidaysMap,
        anniversaryMap,
        fetchOwnAnniversaries,
        calendar,
        addMissions
    }
})
