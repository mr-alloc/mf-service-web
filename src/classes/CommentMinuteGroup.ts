import type CommentSecondGroup from "@/classes/CommentSecondGroup";

export default class CommentMinuteGroup {

    private readonly _time: number;
    private readonly _secondGroup: Array<CommentSecondGroup>;

    constructor(time: number, secondGroup: Array<CommentSecondGroup>) {
        this._time = time;
        this._secondGroup = secondGroup;
    }

    get time(): number {
        return this._time;
    }

    get secondGroup(): Array<CommentSecondGroup> {
        return this._secondGroup;
    }
}
