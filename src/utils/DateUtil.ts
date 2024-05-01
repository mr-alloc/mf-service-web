import moment, {type Moment} from "moment-timezone";

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
const DEFAULT_DATE_TIME_FORMAT = 'YYYY년 MM월 DD일 HH:mm:ss';
const DEFAULT_TIME_ZONE = 'Asia/Seoul';

function secondToDateString(second: number): string {
    return moment(new Date(second * 1000))
        .tz(DEFAULT_TIME_ZONE)
        .format(DEFAULT_DATE_FORMAT)
}

function secondToDateTimeString(second: number): string {
    return moment(new Date(second * 1000))
        .tz(DEFAULT_TIME_ZONE)
        .format(DEFAULT_DATE_TIME_FORMAT)
}

export default {
    DEFAULT_DATE_FORMAT,
    DEFAULT_TIME_ZONE,
    secondToDateString,
    secondToDateTimeString,
    isSameMonth(m1: Moment, m2: Moment): boolean {
        return m1.year() === m2.year() && m1.month() === m2.month();
    },
    toString(m: Moment): string {
        return m.format(DEFAULT_DATE_FORMAT);
    },
    to(moment: Moment, format: string): string {
        return moment.format(format);
    }
}
