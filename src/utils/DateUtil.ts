import moment, {type Moment, tz} from "moment-timezone";
import TempralUtil from "@/utils/TemporalUtil";

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
const DEFAULT_DATE_TIME_FORMAT = 'YYYY년 MM월 DD일 HH:mm:ss';
const DEFAULT_TIME_ZONE = 'Asia/Seoul';

function secondToDateString(second: number): string {
    return moment(new Date((second + TempralUtil.getOffsetSecond()) * 1000))
        .format(DEFAULT_DATE_FORMAT)
}

function secondToDateTimeString(second: number): string {
    return moment(new Date((second + TempralUtil.getOffsetSecond()) * 1000))
        .format(DEFAULT_DATE_TIME_FORMAT)
}

function toKoreanString(second: number): string {
    const now = moment().utc().unix();
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
    const timestamp = moment(date, format).utc(false).unix();
    const offsetSecond = TempralUtil.SECONDS_IN_MINUTE * tz(DEFAULT_TIME_ZONE).utcOffset();
    return timestamp - offsetSecond;
}

export default {
    DEFAULT_DATE_FORMAT,
    DEFAULT_DATE_TIME_FORMAT,
    DEFAULT_TIME_ZONE,
    secondToDateString,
    secondToDateTimeString,
    toKoreanString,
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
    }
}
