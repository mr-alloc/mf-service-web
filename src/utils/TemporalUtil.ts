import DateUtil from "@/utils/DateUtil";
import moment, {tz} from "moment-timezone";

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24;

function getOffsetSecond(): number {
    return SECONDS_IN_MINUTE * tz(DateUtil.DEFAULT_TIME_ZONE).utcOffset();
}

function getEpochSecond(): number {
    return moment().unix();
}

function secondsToTimeStr(remainSeconds: number) {
    let absRemainSeconds = Math.abs(remainSeconds);
    const isNegative = remainSeconds < 0;

    const days = Math.floor(absRemainSeconds / SECONDS_IN_DAY);
    absRemainSeconds -= days * SECONDS_IN_DAY;
    const hasSecondsMod = absRemainSeconds > 0;
    const hours = Math.floor(absRemainSeconds / SECONDS_IN_HOUR);
    absRemainSeconds -= hours * SECONDS_IN_HOUR;
    const minutes = Math.floor(absRemainSeconds / SECONDS_IN_MINUTE);
    absRemainSeconds -= minutes * SECONDS_IN_MINUTE;

    const seconds = absRemainSeconds;
    const negativeStr = isNegative ? "-" : "";
    const daysStr = days > 0 ? days + "일 " : "";
    const hour = String(`${hours}`).padStart(2, "0");
    const minute = String(`${minutes}`).padStart(2, "0");
    const second = String(`${seconds}`).padStart(2, "0");
    console.log('isNegative', isNegative);
    return negativeStr + daysStr + (hasSecondsMod ? `${hour}:${minute}:${second}` : '');
}

export default {
    SECONDS_IN_MINUTE,
    SECONDS_IN_HOUR,
    SECONDS_IN_DAY,
    getOffsetSecond,
    getEpochSecond,
    secondsToTimeStr

}
