import MissionComment from "@/classes/api-spec/MissionComment";

export class ResponseBody {
    private readonly _comments: Array<MissionComment>;

    constructor(comments: MissionComment[]) {
        this._comments = comments;
    }

    get comments(): MissionComment[] {
        return this._comments;
    }

    public static fromJson(json: any): ResponseBody {
        return new ResponseBody(json.comments.map((comment: any) => MissionComment.fromJson(comment)));
    }
}
