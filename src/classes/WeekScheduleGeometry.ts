import DayOfWeek from "@/constant/DayOfWeek";
import CalendarWeekMission from "@/classes/CalendarWeekMission";
import TemporalUtil from "@/utils/TemporalUtil";

export class WeekScheduleGeometry {

    private readonly _x: number;
    private readonly _y: number;
    private readonly _width: number;
    private readonly _mission: CalendarWeekMission;

    constructor(x: number, y: number, mission: CalendarWeekMission) {
        this._x = x;
        this._y = y;
        this._width = TemporalUtil.getDiffDays(mission.startAt, mission.endAt);
        this._mission = mission;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get width(): number {
        return this._width;
    }

    get mission(): CalendarWeekMission {
        return this._mission;
    }

    public endIsAfter(timestamp: number): boolean {
        return this._mission.endAt >= timestamp;
    }

    public toString() {
        const day = DayOfWeek.fromSundayStartValue(this._x);
        return `${day?.name} ${this._y}줄: ${this._mission.toString()}`;
    }
}

