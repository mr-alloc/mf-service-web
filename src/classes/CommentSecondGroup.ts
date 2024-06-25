import type UserComments from "@/classes/UserComments";

export default class CommentSecondGroup {

    private readonly _second: number;
    private readonly _userCommentsGroup: Array<UserComments>;

    constructor(second: number, userCommentsGroup: Array<UserComments>) {
        this._second = second;
        this._userCommentsGroup = userCommentsGroup;
    }

    get second(): number {
        return this._second;
    }

    get userCommentsGroup(): Array<UserComments> {
        return this._userCommentsGroup;
    }
}
