import AnniversaryType from "@/constant/AnniversaryType";
import AnniversaryValue from "@/classes/api-spec/AnniversaryValue";
import TemporalUtil from "@/utils/TemporalUtil";
import DateUtil from "@/utils/DateUtil";
import moment from "moment-timezone";


export default class CalendarAnniversary {
    private readonly _type: AnniversaryType;
    private readonly _name: string;
    private readonly _date: string;

    private constructor(type: AnniversaryType, name: string, date: string) {
        this._type = type;
        this._name = name;
        this._date = date;
    }

    get type(): AnniversaryType {
        return this._type;
    }

    get name(): string {
        return this._name;
    }

    get date(): string {
        return this._date;
    }

    public static of(value: AnniversaryValue): Array<CalendarAnniversary> {
        const anniversaryType = AnniversaryType.fromValue(value.type);

        switch (anniversaryType) {
            case AnniversaryType.PERIOD:
                return CalendarAnniversary.forPeriod(value);
            case AnniversaryType.SINGLE:
                return CalendarAnniversary.forSingle(value);
            case AnniversaryType.MULTIPLE:
                return CalendarAnniversary.forMultiple(value);
            default:
                return [];
        }
    }

    private static forPeriod(value: AnniversaryValue): Array<CalendarAnniversary> {
        const startDay = TemporalUtil.toMoment(value.startTimeStamp!, true);
        const intervalDays = TemporalUtil.getDiffDays(value.startTimeStamp!, value.endTimeStamp!);
        console.log('intervalDays', intervalDays, value);
        return [...new Array(intervalDays).keys()].map((_, interval) => {
            const date = startDay.clone().add(interval, 'days').format(DateUtil.DEFAULT_DATE_FORMAT);
            return new CalendarAnniversary(AnniversaryType.PERIOD, value.name, date);
        });
    }

    private static forSingle(value: AnniversaryValue): Array<CalendarAnniversary> {
        console.log('forSingle', value)
        const forParse = `${value.yearMonth}${String(value.days?.[0]).padStart(2, "0")}`;
        console.log('forParse', forParse)
        const date = moment(forParse, DateUtil.YYYYMMDD).format(DateUtil.DEFAULT_DATE_FORMAT);
        return [new CalendarAnniversary(AnniversaryType.SINGLE, value.name, date)];
    }

    private static forMultiple(value: AnniversaryValue): Array<CalendarAnniversary> {
        return value.days!.sort((a, b) => a - b).map(day => {
            const date = moment(`${value.yearMonth}${String(day).padStart(2, "0")}`, DateUtil.YYYYMMDD).format(DateUtil.DEFAULT_DATE_FORMAT);
            return new CalendarAnniversary(AnniversaryType.MULTIPLE, value.name, date);
        });
    }
}
