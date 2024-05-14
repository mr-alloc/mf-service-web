import DateUtil from "@/utils/DateUtil";
import {tz} from "moment-timezone";

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24;

function getOffsetSecond(): number {
    return SECONDS_IN_MINUTE * tz(DateUtil.DEFAULT_TIME_ZONE).utcOffset();
}

export default {
    SECONDS_IN_MINUTE,
    SECONDS_IN_HOUR,
    SECONDS_IN_DAY,
    getOffsetSecond
}
