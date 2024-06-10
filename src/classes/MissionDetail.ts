import ScheduleValue from "@/classes/api-spec/ScheduleValue";
import MissionState from "@/classes/MissionState";

export default class MissionDetail {
    private readonly _id: number;
    private readonly _name: string;
    private readonly _type: number;
    private readonly _schedule: ScheduleValue
    private readonly _states: Array<MissionState>
    private readonly _deadline?: number;
    private readonly _reporter?: number;
    private readonly _assignee?: number;

    constructor(id: number, name: string, type: number, schedule: ScheduleValue, states: Array<MissionState>, deadline?: number, reporter?: number, assignee?: number) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._schedule = schedule;
        this._states = states;
        this._deadline = deadline;
        this._reporter = reporter;
        this._assignee = assignee;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get type(): number {
        return this._type;
    }

    get schedule(): ScheduleValue {
        return this._schedule;
    }

    get states(): Array<MissionState> {
        return this._states;
    }

    get deadline(): number | undefined {
        return this._deadline;
    }

    get reporter(): number | undefined {
        return this._reporter;
    }

    get assignee(): number | undefined {
        return this._assignee;
    }

    static fromJson(json: any): MissionDetail {
        return new MissionDetail(
            json.id,
            json.name,
            json.type,
            ScheduleValue.fromJson(json.schedule),
            json.states.map(MissionState.fromJson),
            json.deadline,
            json.reporter,
            json.assignee
        );
    }
}
