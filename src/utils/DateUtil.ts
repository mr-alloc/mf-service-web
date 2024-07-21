import moment, {type Moment} from "moment-timezone";
import TempralUtil from "@/utils/TemporalUtil";
import TemporalUtil from "@/utils/TemporalUtil";
import CalendarDate from "@/classes/CalendarDate";
import CollectionUtil from "@/utils/CollectionUtil";

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
const DEFAULT_DATE_TIME_FORMAT = 'YYYY년 MM월 DD일 HH:mm:ss';
const DEFAULT_TIME_ZONE = 'Asia/Seoul';
const YYYYMM = 'YYYYMM';
const YYYYMMDD = 'YYYYMMDD';

function secondToDateString(second: number): string {
    const totalSeconds = second + TempralUtil.getOffsetSecond();
    return moment(new Date(totalSeconds * 1000))
        .utc(false)
        .format(DEFAULT_DATE_FORMAT);
}

function secondToDateTimeString(second: number): string {
    return moment(new Date((second + TempralUtil.getOffsetSecond()) * 1000))
        .utc(false)
        .format(DEFAULT_DATE_TIME_FORMAT)
}

function secondsToString(second: number, format: string): string {
    return moment(new Date((second + TempralUtil.getOffsetSecond()) * 1000))
        .utc(false)
        .format(format)
}

function toKoreanString(second: number): string {
    const now = moment().utc(false).unix();
    const seconds = now - second;

    if (seconds < 60) return `방금 전`

    const minutes = seconds / 60
    if (minutes < 60) return `${Math.floor(minutes)}분 전`

    const hours = minutes / 60
    if (hours < 24) return `${Math.floor(hours)}시간 전`

    const days = hours / 24
    if (days < 7) return `${Math.floor(days)}일 전`

    const weeks = days / 7
    if (weeks < 5) return `${Math.floor(weeks)}주 전`

    const months = days / 30
    if (months < 12) return `${Math.floor(months)}개월 전`

    const years = days / 365
    return `${Math.round(years)}년 전`
}

function toUtc(date: string, format: string): number {
    if (date === '') return 0;

    return moment(date, format).utc(false).unix();
}

function getCalendarDays(momentValue: Moment, calculatedWith?: (startOfCalendar: Moment, startOfThisMonth: Moment, endOfThisMonth: Moment, endOfCalendar: Moment) => void): Array<CalendarDate> {
    const startOfThisMonth = moment(momentValue).startOf('month');
    const startOfCalendar = startOfThisMonth.subtract(startOfThisMonth.day(), 'days');
    const endOfThisMonth = moment(momentValue).endOf('month');
    const endOfCalendar = endOfThisMonth.add(7 - (endOfThisMonth.day() + 1), 'days');
    calculatedWith && calculatedWith(startOfCalendar, startOfThisMonth, endOfThisMonth, endOfCalendar);
    return [...new Array(endOfCalendar.diff(startOfCalendar, 'days') + 1).keys()]
        .map((_, interval) => {
            const cloned = startOfCalendar.clone();
            const date = cloned.add(interval, 'days');
            return new CalendarDate(date.unix() - TempralUtil.getOffsetSecond());
        });
}

function getCalendarWeeks(momentValue: Moment, calculatedWith?: (startOfCalendar: Moment, startOfThisMonth: Moment, endOfThisMonth: Moment, endOfCalendar: Moment) => void): Map<number, Array<CalendarDate>> {
    const startOfThisMonth = moment(momentValue).startOf('month');
    const startOfCalendar = startOfThisMonth.clone().subtract(startOfThisMonth.day(), 'days');
    const endOfThisMonth = moment(momentValue).endOf('month');
    const endOfCalendar = endOfThisMonth.clone().add(7 - (endOfThisMonth.day() + 1), 'days');

    calculatedWith && calculatedWith(startOfCalendar, startOfThisMonth, endOfThisMonth, endOfCalendar);
    const totalDays = [...new Array(endOfCalendar.diff(startOfCalendar, 'days') + 1).keys()]
        .map((_, interval) => {
            const cloned = startOfCalendar.clone();
            const date = cloned.add(interval, 'days');
            return new CalendarDate(date.unix(), Math.floor(interval / 7) + 1);
        });

    return CollectionUtil.grouping(totalDays, (day) => day.weekOfCalendar);
}

function forEachWeek(startStamp: number, endStamp: number, callback: (week: number, start: number, end: number) => void) {
    if (startStamp > endStamp) throw new Error('startStamp should be less than endStamp');
    const start = TemporalUtil.toLocalMoment(startStamp);
    const end = TemporalUtil.toLocalMoment(endStamp);

    const startOfWeek = start.clone().startOf('week');
    const endOfWeek = end.clone().endOf('week');

    let week = 1;
    const current = startOfWeek.clone();
    const weekMap = new Map<number, Array<CalendarDate>>();
    while (current.isBefore(endOfWeek)) {
        const startStamp = current.clone().unix() - TempralUtil.getOffsetSecond()
        const endStamp = current.clone().endOf('week').unix() - TempralUtil.getOffsetSecond();
        callback(week, startStamp, endStamp);
        //주별 요일정보
        new Array<number>(7).fill(0).forEach((_, idx) => {
            const date = current.clone().startOf('week').add(idx, 'days');
            const calendarDate = new CalendarDate(date.unix() - TempralUtil.getOffsetSecond(), week);
            if (weekMap.has(week)) {
                const days = weekMap.get(week);
                if (days) {
                    days.push(calendarDate);
                }
            } else {
                weekMap.set(week, [calendarDate]);
            }
        });
        week++;
        current.add(1, 'week');
    }
    return weekMap;
}

export default {
    DEFAULT_DATE_FORMAT,
    DEFAULT_DATE_TIME_FORMAT,
    DEFAULT_TIME_ZONE,
    secondToDateString,
    secondToDateTimeString,
    secondsToString,
    toKoreanString,
    YYYYMM,
    YYYYMMDD,
    getCalendarWeeks,


    isSameMonth(m1: Moment, m2: Moment): boolean {
        return m1.year() === m2.year() && m1.month() === m2.month();
    },
    toString(m: Moment): string {
        return m.format(DEFAULT_DATE_FORMAT);
    },
    to(moment: Moment, format: string): string {
        return moment.format(format);
    },
    toUtc,
    getTodayStr(format: string): string {
        return moment().format(format);
    },
    getCalendarDays,
    forEachWeek
}
